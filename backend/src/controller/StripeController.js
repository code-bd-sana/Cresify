import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../models/OrderModel.js";
import Payment from "../models/PaymentModel.js";
import Product from "../models/ProductModel.js";
import Transaction from "../models/TransactionModel.js";
import WalletLedger from "../models/WalletLedgerModel.js";
import Wallet from "../models/WalletModel.js";
import WebhookLog from "../models/WebhookLogModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Stripe Webhook Handler
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ─────────────────────────────────────
  // Webhook Idempotency Log (fire-and-forget on duplicate)
  // ─────────────────────────────────────
  try {
    await WebhookLog.create({
      eventId: event.id,
      provider: "stripe",
      type: event.type,
      payload: event.data.object,
      signature: sig,
    });
  } catch (_) {
    // Duplicate webhook → safe to ignore
  }

  // =========================================================
  // ✅ PAYMENT SUCCESS: checkout.session.completed
  // =========================================================
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        let payment = await Payment.findOne({
          stripeSessionId: stripeSession.id,
        }).session(session);

        // Fallback: create payment record if not found (rare edge case)
        if (!payment && stripeSession.metadata?.orderId) {
          const order = await Order.findById(
            stripeSession.metadata.orderId
          ).session(session);
          if (order) {
            [payment] = await Payment.create(
              [
                {                  order: order._id,
                  buyer: stripeSession.metadata.userId,
                  amount: stripeSession.amount_total / 100,
                  currency: stripeSession.currency || "usd",
                  status: "pending",
                  method: "stripe_checkout",
                  stripeSessionId: stripeSession.id,
                  stripePaymentIntentId: stripeSession.payment_intent,
                  metadata: {
                    sellerBreakdown: stripeSession.metadata?.sellerBreakdown
                      ? JSON.parse(stripeSession.metadata.sellerBreakdown)
                      : [],
                  },
                },
              ],
              { session }
            );
          }
        }

        // Idempotency guard
        if (!payment || payment.status === "paid") {
          return; // Nothing to do → commit will still happen
        }

        // Mark payment as paid
        payment.status = "paid";
        payment.capturedAt = new Date();
        await payment.save({ session });

        // Update order
        const order = await Order.findById(payment.order).session(session);
        if (order) {
          order.paymentStatus = "paid";
          order.status = "processing";
          await order.save({ session });
        }

        // Hold funds in seller wallets
        for (const b of payment.metadata?.sellerBreakdown || []) {
          const { sellerId, net } = b;

          let wallet = await Wallet.findOne({ user: sellerId }).session(
            session
          );
          if (!wallet) {
            [wallet] = await Wallet.create(
              [{ user: sellerId, balance: 0, reserved: 0 }],
              { session }
            );
          }

          const beforeReserved = wallet.reserved;
          wallet.reserved += net;
          await wallet.save({ session });

          // Ledger entry
          await WalletLedger.create(
            [
              {
                user: sellerId,
                type: "credit",
                amount: net,
                reason: "sale_hold",
                refId: order._id,
              },
            ],
            { session }
          );

          // Transaction record
          await Transaction.create(
            [
              {
                transactionId: `${payment.paymentId}-hold-${sellerId}`,
                type: "hold",
                wallet: wallet._id,
                user: sellerId,
                order: order._id,
                payment: payment._id,
                amount: net,
                currency: payment.currency,
                balanceBefore: beforeReserved,
                balanceAfter: wallet.reserved,
              },
            ],
            { session }
          );
        }
      });

      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook success processing error:", err);
      return res.status(500).send("Transaction failed");
    } finally {
      session.endSession();
    }
  }

  // =========================================================
  // ❌ PAYMENT FAILED / EXPIRED
  // =========================================================
  else if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "payment_intent.payment_failed"
  ) {
    const payload = event.data.object;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        let payment =
          (payload.id &&
            (await Payment.findOne({ stripeSessionId: payload.id }).session(
              session
            ))) ||
          (payload.payment_intent &&
            (await Payment.findOne({
              stripePaymentIntentId: payload.payment_intent,
            }).session(session)));

        // Idempotency guard
        if (!payment || payment.status === "paid") {
          return;
        }

        payment.status = "failed";
        await payment.save({ session });

        const order = await Order.findById(payment.order).session(session);
        if (order) {
          order.paymentStatus = "failed";
          order.status = "canceled";
          await order.save({ session });

          // Restore product stock
          for (const pid of order.products) {
            await Product.updateOne(
              { _id: pid },
              { $inc: { stock: 1 } },
              { session }
            );
          }
        }
      });

      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook failure processing error:", err);
      return res.status(500).send("Transaction failed");
    } finally {
      session.endSession();
    }
  }

  // =========================================================
  // OTHER EVENTS → acknowledge
  // =========================================================
  return res.json({ received: true });
};

export default { stripeWebhook };
