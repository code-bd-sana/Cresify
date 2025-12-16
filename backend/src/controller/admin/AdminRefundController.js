import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../../models/OrderModel.js";
import Payment from "../../models/PaymentModel.js";
import Refund from "../../models/RefundModel.js";
import Transaction from "../../models/TransactionModel.js";
import WalletLedger from "../../models/WalletLedgerModel.js";
import Wallet from "../../models/WalletModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

export const listRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ refunds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to list refunds" });
  }
};

/**
 * Admin reviews and processes a refund request.
 * body: { refundId, action: 'approve'|'partial'|'reject', adminId }
 */
export const reviewRefund = async (req, res) => {
  const { refundId, action, adminId } = req.body;

  if (!refundId || !action || !adminId)
    return res.status(400).json({ message: "Missing fields" });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const refund = await Refund.findById(refundId).session(session);
      if (!refund) throw new Error("Refund not found");

      if (action === "reject") {
        refund.status = "rejected";
        refund.processedBy = adminId;
        refund.processedAt = new Date();
        await refund.save({ session });
        return res.json({ message: "Refund rejected", refund });
      }

      const payment = await Payment.findById(refund.payment).session(session);
      const order = await Order.findById(refund.order).session(session);
      if (!payment || !order) throw new Error("Payment or order not found");

      const refundAmount = Number(refund.amount);

      let stripeRefund = null;
      if (payment.method === "stripe_checkout" && payment.paymentId) {
        // Create Stripe refund (amount in cents)
        try {
          stripeRefund = await stripe.refunds.create({
            payment_intent: payment.paymentId,
            amount: Math.round(refundAmount * 100),
          });
          refund.refundId = stripeRefund.id;
          refund.stripeRefundId = stripeRefund.id;
        } catch (err) {
          console.error("Stripe refund error", err);
          throw err;
        }
      }

      // Update refund record
      refund.status =
        refundAmount >= payment.amount ? "refunded_full" : "refunded_partial";
      refund.processedBy = adminId;
      refund.processedAt = new Date();
      await refund.save({ session });

      // Link refund to payment
      payment.refunds = payment.refunds || [];
      payment.refunds.push(refund._id);
      // If full refund, mark payment refunded
      if (refund.status === "refunded_full") payment.status = "refunded";
      await payment.save({ session });

      // Adjust order and seller wallets proportionally (bulk operations)
      const ratio = Math.min(1, refundAmount / payment.amount);
      const sellers = payment.metadata?.sellerBreakdown || [];

      if (sellers.length) {
        const sellerIds = sellers.map((s) => s.sellerId);
        const wallets = await Wallet.find({ user: { $in: sellerIds } }).session(
          session
        );
        const walletByUser = new Map(
          wallets.map((w) => [w.user.toString(), w])
        );

        const walletBulkOps = [];
        const ledgerDocs = [];
        const txDocs = [];

        for (const b of sellers) {
          const { sellerId, net } = b;
          const deduct = net * ratio;

          const wallet = walletByUser.get(
            sellerId?.toString ? sellerId.toString() : String(sellerId)
          );
          if (!wallet) continue;

          const beforeReserved = wallet.reserved || 0;
          const newReserved = Math.max(0, beforeReserved - deduct);

          walletBulkOps.push({
            updateOne: {
              filter: { _id: wallet._id },
              update: { $set: { reserved: newReserved } },
            },
          });

          ledgerDocs.push({
            user: sellerId,
            type: "debit",
            amount: deduct,
            reason: "refund",
            refId: order._id,
          });

          txDocs.push({
            transactionId: `${payment._id}-refund-${sellerId}-${Date.now()}`,
            type: "refund",
            wallet: wallet._id,
            user: sellerId,
            order: order._id,
            payment: payment._id,
            amount: deduct,
            currency: payment.currency,
            balanceBefore: beforeReserved,
            balanceAfter: newReserved,
          });
        }

        if (walletBulkOps.length) {
          await Wallet.bulkWrite(walletBulkOps, { session });
        }
        if (ledgerDocs.length) {
          await WalletLedger.insertMany(ledgerDocs, { session });
        }
        if (txDocs.length) {
          await Transaction.insertMany(txDocs, { session });
        }
      }

      // Update order status for full refunds
      if (refund.status === "refunded_full") {
        order.paymentStatus = "refunded";
        order.status = "refunded";
        await order.save({ session });
      }

      return res.json({ message: "Refund processed", refund, stripeRefund });
    });
  } catch (err) {
    console.error("reviewRefund error", err);
    if (session.inTransaction && session.inTransaction())
      await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Failed to process refund", error: err.message });
  }
};

export default { listRefunds, reviewRefund };
