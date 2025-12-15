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

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log webhook raw
  try {
    await WebhookLog.create({
      eventId: event.id,
      provider: "stripe",
      type: event.type,
      payload: event.data.object,
      signature: sig,
    });
  } catch (e) {
    console.warn("Could not save webhook log:", e.message);
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;

    const dbSession = await mongoose.startSession();
    try {
      dbSession.startTransaction();

      // find payment record
      let payment = await Payment.findOne({
        stripeSessionId: sessionId,
      }).session(dbSession);
      if (!payment) {
        // try by order id metadata
        if (session.metadata?.orderId) {
          const orderId = session.metadata.orderId;
          const order = await Order.findById(orderId).session(dbSession);
          if (order) {
            payment = await Payment.create(
              [
                {
                  paymentId: session.payment_intent || sessionId,
                  order: order._id,
                  buyer: session.metadata?.userId,
                  amount: session.amount_total / 100,
                  currency:
                    session.currency || process.env.DEFAULT_CURRENCY || "usd",
                  status: "pending",
                  method: "stripe_checkout",
                  stripeSessionId: sessionId,
                  metadata: {
                    sellerBreakdown: session.metadata?.sellerBreakdown
                      ? JSON.parse(session.metadata.sellerBreakdown)
                      : undefined,
                  },
                },
              ],
              { session: dbSession }
            );
            payment = payment[0];
          }
        }
      }

      if (!payment) {
        console.error("No payment record found for session", sessionId);
        await dbSession.abortTransaction();
        return res.status(404).send();
      }

      // update payment
      payment.status = "paid";
      payment.stripePaymentIntentId = session.payment_intent;
      payment.capturedAt = new Date();
      await payment.save({ session: dbSession });

      // mark order paid
      const order = await Order.findById(payment.order).session(dbSession);
      if (order) {
        order.paymentStatus = "paid";
        order.status = "processing";
        await order.save({ session: dbSession });
      }

      // process seller breakdown: hold funds in seller wallets (reserved)
      const breakdown =
        payment.metadata?.sellerBreakdown ||
        (session.metadata?.sellerBreakdown
          ? JSON.parse(session.metadata.sellerBreakdown)
          : []);

      for (const b of breakdown) {
        const { sellerId, gross, platformFee, net } = b;

        let wallet = await Wallet.findOne({ user: sellerId }).session(
          dbSession
        );
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
      dbSession.endSession();

      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook handler error:", err);
      await dbSession.abortTransaction();
      dbSession.endSession();
      return res.status(500).send();
    }
  }

  // handle failed/expired sessions or failed payment intents
  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "payment_intent.payment_failed"
  ) {
    const payload = event.data.object;
    const sessionId = payload.id || payload.session || null;
    const paymentIntentId = payload.payment_intent || payload.id || null;

    const dbSession = await mongoose.startSession();
    try {
      dbSession.startTransaction();

      let payment = null;
      if (sessionId)
        payment = await Payment.findOne({ stripeSessionId: sessionId }).session(
          dbSession
        );
      if (!payment && paymentIntentId)
        payment = await Payment.findOne({
          stripePaymentIntentId: paymentIntentId,
        }).session(dbSession);

      if (!payment && payload.metadata?.orderId) {
        const order = await Order.findById(payload.metadata.orderId).session(
          dbSession
        );
        if (order)
          payment = await Payment.findOne({ order: order._id }).session(
            dbSession
          );
      }

      if (!payment) {
        await dbSession.commitTransaction();
        dbSession.endSession();
        return res.json({ received: true });
      }

      // mark payment failed
      payment.status = "failed";
      await payment.save({ session: dbSession });

      // mark order canceled and restore stock
      const order = await Order.findById(payment.order).session(dbSession);
      if (order) {
        order.paymentStatus = "failed";
        order.status = "canceled";
        await order.save({ session: dbSession });

        // restore stock counts
        const counts = {};
        for (const pid of order.products) {
          const key = pid.toString();
          counts[key] = (counts[key] || 0) + 1;
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
      dbSession.endSession();
      return res.json({ received: true });
    } catch (err) {
      console.error("Webhook failure handler error:", err);
      await dbSession.abortTransaction();
      dbSession.endSession();
      return res.status(500).send();
    }
  }

  // Other events - return 200
  return res.json({ received: true });
};

export default { stripeWebhook };
