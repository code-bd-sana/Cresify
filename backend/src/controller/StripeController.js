import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";

import Order from "../models/OrderModel.js";
import OrderVendor from "../models/OrderVendorModel.js";
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

  /* ───────────── Idempotency Log ───────────── */
  try {
    await WebhookLog.create({
      eventId: event.id,
      provider: "stripe",
      type: event.type,
      payload: event.data.object,
    });
  } catch {
    return res.json({ received: true }); // duplicate webhook
  }

  /* =====================================================
     ✅ PAYMENT SUCCESS
     ===================================================== */
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        if (stripeSession.metadata?.itemType !== "product") return;

        let payment = await Payment.findOne({
          stripeSessionId: stripeSession.id,
        }).session(session);

        /* Fallback create (edge case) */
        if (!payment && stripeSession.metadata?.orderId) {
          const order = await Order.findById(
            stripeSession.metadata.orderId
          ).session(session);

          if (!order) return;

          [payment] = await Payment.create(
            [
              {
                order: order._id,
                buyer: stripeSession.metadata.userId,
                amount: stripeSession.amount_total / 100,
                currency: stripeSession.currency || "usd",
                status: "pending",
                method: "stripe_checkout",
                stripeSessionId: stripeSession.id,
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

        /* Idempotency */
        if (!payment || payment.status === "paid") return;

        payment.status = "paid";
        payment.capturedAt = new Date();
        await payment.save({ session });

        const order = await Order.findById(payment.order).session(session);
        if (!order) return;

        order.paymentStatus = "paid";
        await order.save({ session });

        /* Hold seller funds */
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

          const before = wallet.reserved;
          wallet.reserved += net;
          await wallet.save({ session });

          await WalletLedger.create(
            [
              {
                seller: sellerId,
                type: "credit",
                amount: net,
                reason: "sale_hold",
                refId: order._id,
              },
            ],
            { session }
          );

          await Transaction.create(
            [
              {
                transactionId: `hold-${payment._id}-${sellerId}`,
                type: "hold",
                wallet: wallet._id,
                user: sellerId,
                order: order._id,
                payment: payment._id,
                amount: net,
                currency: payment.currency,
                balanceBefore: before,
                balanceAfter: wallet.reserved,
              },
            ],
            { session }
          );
        }
      });

      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook success error:", err);
      return res.status(500).send("Webhook processing failed");
    } finally {
      session.endSession();
    }
  }

  /* =====================================================
     ❌ PAYMENT FAILED / EXPIRED
     ===================================================== */
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const payload = event.data.object;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const payment = await Payment.findOne({
          stripeSessionId: payload.id,
        }).session(session);

        if (!payment || payment.status === "paid") return;

        payment.status = "failed";
        await payment.save({ session });

        const order = await Order.findById(payment.order).session(session);
        if (!order) return;

        order.paymentStatus = "failed";
        await order.save({ session });

        /* Restore stock via OrderVendor */
        const vendors = await OrderVendor.find({
          order: order._id,
        }).session(session);

        for (const v of vendors) {
          for (const p of v.products) {
            await Product.updateOne(
              { _id: p.product },
              { $inc: { stock: p.quantity } },
              { session }
            );
          }
        }
      });

      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook failure error:", err);
      return res.status(500).send("Webhook processing failed");
    } finally {
      session.endSession();
    }
  }

  return res.json({ received: true });
};

export default { stripeWebhook };
