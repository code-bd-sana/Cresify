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
import { toTwo } from "../utils/money.js";
import Booking from "../models/BookingModel.js";

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
     PAYMENT SUCCESS
     ===================================================== */
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object;
      const dbSession = await mongoose.startSession();
    const session = await mongoose.startSession();

    console.log(stripeSession, 'stripeSession in webhook alalh goooo');
    try {
      await session.withTransaction(async () => {
        // Find the payment by stripeSessionId
        const payment = await Payment.findOne({
          stripeSessionId: stripeSession.id,
        }).session(session);

        if (!payment) {
          throw new Error(`Payment not found for session: ${stripeSession.id}`);
        }

        if (stripeSession.metadata?.itemType === "product") {
          /* Fallback create (edge case) */
          if (!payment && stripeSession.metadata?.orderId) {
            const order = await Order.findById(
              new mongoose.Types.ObjectId(stripeSession.metadata.orderId)
            ).session(session);

            if (!order) return;

            // Parse seller breakdown from session metadata and compute commission totals
            const parsedSellerBreakdown = stripeSession.metadata
              ?.sellerBreakdown
              ? JSON.parse(stripeSession.metadata.sellerBreakdown)
              : [];

            const totalCommissionAmount = toTwo(
              parsedSellerBreakdown.reduce(
                (sum, s) => sum + (s.commissionAmount || 0),
                0
              )
            );
            const totalCommissionVATAmount = toTwo(
              parsedSellerBreakdown.reduce(
                (sum, s) => sum + (s.commissionVATAmount || 0),
                0
              )
            );

            [payment] = await Payment.create(
              [
                {
                  order: order._id,
                  buyer: stripeSession.metadata.userId,
                  amount: toTwo(stripeSession.amount_total / 100),
                  currency: stripeSession.currency || "usd",
                  status: "pending",
                  method: "stripe_checkout",
                  stripeSessionId: stripeSession.id,
                  metadata: { sellerBreakdown: parsedSellerBreakdown },
                  commissionAmount: toTwo(totalCommissionAmount),
                  commissionVATAmount: toTwo(totalCommissionVATAmount),
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

          const order = await Order.findById(
            new mongoose.Types.ObjectId(payment.order)
          ).session(session);
          if (!order) return;

          order.paymentStatus = "paid";

          await order.save({ session });

          /* Hold seller funds — optimized: batch wallet creation, updates, ledgers, and transactions */
          const sellers = payment.metadata?.sellerBreakdown || [];
          if (sellers.length) {
            const sellerIds = sellers.map((s) => s.sellerId);

            // Load existing wallets
            const wallets = await Wallet.find({
              user: { $in: sellerIds },
            }).session(session);
            const walletByUser = new Map(
              wallets.map((w) => [w.user.toString(), w])
            );

            // Create missing wallets in bulk
            const missing = sellerIds.filter(
              (id) =>
                !walletByUser.has(id?.toString ? id.toString() : String(id))
            );
            if (missing.length) {
              const createDocs = missing.map((id) => ({
                user: id,
                balance: 0,
                reserved: 0,
              }));
              const created = await Wallet.insertMany(createDocs, { session });
              for (const w of created) walletByUser.set(w.user.toString(), w);
            }

            // Prepare bulk operations and docs
            const walletBulkOps = [];
            const ledgerDocs = [];
            const txDocs = [];

            for (const b of sellers) {
              const { sellerId, net } = b;
              const key = sellerId?.toString
                ? sellerId.toString()
                : String(sellerId);
              const wallet = walletByUser.get(key);
              if (!wallet) continue;

              const before = toTwo(wallet.reserved || 0);
              const after = toTwo(before + net);

              walletBulkOps.push({
                updateOne: {
                  filter: { _id: wallet._id },
                  update: { $set: { reserved: after } },
                },
              });

              ledgerDocs.push({
                seller: new mongoose.Types.ObjectId(sellerId),
                type: "credit",
                amount: toTwo(net),
                reason: "sale",
                refId: new mongoose.Types.ObjectId(order._id),
              });

              txDocs.push({
                transactionId: `hold-${payment._id}-${sellerId}-${Date.now()}`,
                type: "hold",
                wallet: new mongoose.Types.ObjectId(wallet._id),
                user: new mongoose.Types.ObjectId(sellerId),
                order: new mongoose.Types.ObjectId(order._id),
                payment: new mongoose.Types.ObjectId(payment._id),
                amount: toTwo(net),
                currency: payment.currency,
                balanceBefore: toTwo(before),
                balanceAfter: toTwo(after),
              });
            }

            if (walletBulkOps.length)
              await Wallet.bulkWrite(walletBulkOps, { session });
            if (ledgerDocs.length)
              await WalletLedger.insertMany(ledgerDocs, { session });
            if (txDocs.length)
              await Transaction.insertMany(txDocs, { session });
          }
        }  else if (stripeSession.metadata?.itemType === "service") {
          if (payment.status === "paid") return;

          const booking = await Booking.findById(payment.booking).session(
            dbSession
          );
          if (!booking) {
            throw new Error(`Booking not found for payment ${payment._id}`);
          }

          /* ---- PROVIDER PAYOUT CALCULATION ---- */
          const providerPayout =
            payment.amount -
            (payment.commissionAmount || 0) -
            (payment.commissionVATAmount || 0);

          if (typeof providerPayout !== "number" || isNaN(providerPayout)) {
            throw new Error(
              `Invalid provider payout for payment ${payment._id}`
            );
          }

          /* ---- UPDATE PAYMENT ---- */
          payment.status = "paid";
          payment.paymentId = stripeSession.payment_intent;
          payment.capturedAt = new Date();
          payment.metadata = {
            ...payment.metadata,
            stripePaymentIntent: stripeSession.payment_intent,
            stripeCustomer: stripeSession.customer,
          };

          await payment.save({ session: dbSession });

          /* ---- UPDATE BOOKING ---- */
          booking.paymentStatus = "completed";
          booking.status = "accept";
          await booking.save({ session: dbSession });

          /* ---- WALLET UPDATE ---- */
          await Wallet.findOneAndUpdate(
            { user: payment.provider },
            {
              $inc: {
                currentBalance: providerPayout,
                reserved: providerPayout,
              },
            },
            { upsert: true, new: true, session: dbSession }
          );

          /* ---- WALLET LEDGER ---- */
          await WalletLedger.create(
            [
              {
                provider: payment.provider,
                type: "credit",
                amount: providerPayout,
                reason: "service_sale",
                refId: booking._id,
              },
            ],
            { session: dbSession }
          );

          /* ---- TRANSACTION HOLD ---- */
          await Transaction.create(
            [
              {
                transactionId: `hold_${payment._id}_${Date.now()}`,
                type: "hold",
                user: payment.provider,
                payment: payment._id,
                amount: providerPayout,
                currency: payment.currency,
                metadata: {
                  bookingId: booking._id,
                  commissionAmount: payment.commissionAmount,
                  commissionVATAmount: payment.commissionVATAmount,
                },
              },
            ],
            { session: dbSession }
          );
        }
      });

      return res.json({ received: true });Payment
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

        /* Idempotency */
        if (!payment || payment.status === "failed") return;

        if (payload.metadata?.itemType !== "product") {
          // Mark payment as paid and record provider payment id
          payment.status = "paid";
          payment.capturedAt = new Date();
          // Ensure we store the provider payment identifier (PaymentIntent)
          payment.paymentId = stripeSession.payment_intent || stripeSession.id;
          await payment.save({ session });
          payment.status = "failed";
          payment.failedAt = new Date();
          await payment.save({ session });

          /* Update order */
          const order = await Order.findById(
            new mongoose.Types.ObjectId(payment.order)
          ).session(session);
          if (!order) return;

          order.paymentStatus = "failed";
          await order.save({ session });

          /* Cancel vendor orders */
          const vendors = await OrderVendor.find({
            order: order._id,
          }).session(session);

          for (const v of vendors) {
            if (v.status !== "canceled") {
              v.status = "canceled";
              await v.save({ session });
            }
          }

          /* Restore stock (STRICT + SAFE) */
          const stockRestoreOps = [];

          for (const v of vendors) {
            for (const p of v.products) {
              stockRestoreOps.push({
                updateOne: {
                  filter: { _id: p.product },
                  update: { $inc: { stock: p.quantity } },
                },
              });
            }
          }

          if (stockRestoreOps.length) {
            await Product.bulkWrite(stockRestoreOps, { session });
          }
        } else if (payload.metadata?.itemType === "service") {
          // Mark payment as paid and record provider payment id
          payment.status = "paid";
          payment.capturedAt = new Date();
          // Ensure we store the provider payment identifier (PaymentIntent)
          payment.paymentId = stripeSession.payment_intent || stripeSession.id;
          await payment.save({ session });
          payment.status = "failed";
          payment.failedAt = new Date();
          await payment.save({ session });

           // Find the booking
          const booking = await Booking.findById(payment.booking);

          if (!booking) {
            throw new Error(`Booking not found for payment: ${payment._id}`);
          }

          
          // Update booking status
          booking.paymentStatus = "cancelled";
          booking.status = "failed"; // Automatically accept when paid
          await booking.save({ session });

          /* Update order */
          // const order = await Order.findById(
          //   new mongoose.Types.ObjectId(payment.order)
          // ).session(session);
          // if (!order) return;

          // order.paymentStatus = "failed";
          // await order.save({ session });
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
