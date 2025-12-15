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
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ─────────────────────────────────────
  // Save webhook log (idempotency helper)
  // ─────────────────────────────────────
  try {
    await WebhookLog.create({
      eventId: event.id,
      provider: "stripe",
      type: event.type,
      payload: event.data.object,
      signature: sig,
    });
  } catch (e) {
    // duplicate webhook → safe to ignore
  }

  // =========================================================
  // ✅ PAYMENT SUCCESS
  // =========================================================
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;
    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      // 🔹 Find payment
      let payment = await Payment.findOne({
        stripeSessionId: stripeSession.id,
      }).session(dbSession);

      // Fallback: create payment from metadata
      if (!payment && stripeSession.metadata?.orderId) {
        const order = await Order.findById(
          stripeSession.metadata.orderId
        ).session(dbSession);

        if (order) {
          [payment] = await Payment.create(
            [
              {
                paymentId: stripeSession.payment_intent || stripeSession.id,
                order: order._id,
                buyer: stripeSession.metadata.userId,
                amount: stripeSession.amount_total / 100,
                currency:
                  stripeSession.currency ||
                  process.env.DEFAULT_CURRENCY ||
                  "usd",
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
            { session: dbSession }
          );
        }
      }

      if (!payment) {
        await dbSession.commitTransaction();
        return res.json({ received: true });
      }

      // 🔒 Idempotency guard
      if (payment.status === "paid") {
        await dbSession.commitTransaction();
        return res.json({ received: true });
      }

      // 🔹 Mark payment paid
      payment.status = "paid";
      payment.capturedAt = new Date();
      await payment.save({ session: dbSession });

      // 🔹 Update order
      const order = await Order.findById(payment.order).session(dbSession);
      if (order) {
        order.paymentStatus = "paid";
        order.status = "processing";
        await order.save({ session: dbSession });
      }

      // 🔹 Seller wallet hold
      const breakdown = payment.metadata?.sellerBreakdown || [];

      for (const b of breakdown) {
        const { sellerId, net } = b;

        let wallet = await Wallet.findOne({
          user: sellerId,
        }).session(dbSession);

        if (!wallet) {
          [wallet] = await Wallet.create(
            [{ user: sellerId, balance: 0, reserved: 0 }],
            { session: dbSession }
          );
        }

        const beforeReserved = wallet.reserved;
        wallet.reserved += net;
        await wallet.save({ session: dbSession });

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
          { session: dbSession }
        );

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
          { session: dbSession }
        );
      }

      await dbSession.commitTransaction();
      return res.json({ received: true });
    } catch (err) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }
      console.error("❌ Webhook success handler error:", err);
      return res.status(500).send();
    } finally {
      dbSession.endSession();
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
    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      let payment =
        (payload.id &&
          (await Payment.findOne({
            stripeSessionId: payload.id,
          }).session(dbSession))) ||
        (payload.payment_intent &&
          (await Payment.findOne({
            stripePaymentIntentId: payload.payment_intent,
          }).session(dbSession)));

      if (!payment && payload.metadata?.orderId) {
        payment = await Payment.findOne({
          order: payload.metadata.orderId,
        }).session(dbSession);
      }

      if (!payment || payment.status === "paid") {
        await dbSession.commitTransaction();
        return res.json({ received: true });
      }

      payment.status = "failed";
      await payment.save({ session: dbSession });

      const order = await Order.findById(payment.order).session(dbSession);
      if (order) {
        order.paymentStatus = "failed";
        order.status = "canceled";
        await order.save({ session: dbSession });

        // 🔁 Restore stock
        const counts = {};
        for (const pid of order.products) {
          counts[pid.toString()] = (counts[pid.toString()] || 0) + 1;
        }

        for (const [pid, qty] of Object.entries(counts)) {
          await Product.updateOne(
            { _id: pid },
            { $inc: { stock: qty } },
            { session: dbSession }
          );
        }
      }

      await dbSession.commitTransaction();
      return res.json({ received: true });
    } catch (err) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }
      console.error("❌ Webhook failure handler error:", err);
      return res.status(500).send();
    } finally {
      dbSession.endSession();
    }
  }

  // =========================================================
  // ℹ️ OTHER EVENTS
  // =========================================================
  return res.json({ received: true });
};

export default { stripeWebhook };
