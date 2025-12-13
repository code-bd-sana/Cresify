import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../../models/OrderModel.js";
import Payment from "../../models/PaymentModel.js";
import Refund from "../../models/RefundModel.js";
import Transaction from "../../models/TransactionModel.js";
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
 * body: { refundId, action: 'approve'|'partial'|'reject', amount, adminId }
 */
export const reviewRefund = async (req, res) => {
  const { refundId, action, amount, adminId } = req.body;

  if (!refundId || !action)
    return res.status(400).json({ message: "Missing fields" });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const refund = await Refund.findById(refundId).session(session);
    if (!refund) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Refund not found" });
    }

    const payment = await Payment.findById(refund.payment).session(session);
    if (!payment) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Payment not found" });
    }

    // Determine refund amount
    const refundAmount =
      action === "reject" ? 0 : Number(amount || refund.amount || 0);

    if (action === "reject") {
      refund.status = "rejected";
      refund.processedBy = adminId;
      refund.processedAt = new Date();
      await refund.save({ session });
      await session.commitTransaction();
      return res.json({ message: "Refund rejected", refund });
    }

    // Call Stripe refund API (if payment has stripePaymentIntentId)
    let stripeRefund = null;
    if (payment.stripePaymentIntentId) {
      try {
        stripeRefund = await stripe.refunds.create({
          payment_intent: payment.stripePaymentIntentId,
          amount: Math.round(refundAmount * 100),
        });
      } catch (stripeErr) {
        console.error("Stripe refund failed", stripeErr);
        await session.abortTransaction();
        return res
          .status(502)
          .json({ message: "Stripe refund failed", error: stripeErr.message });
      }
    }

    // Update refund record
    refund.stripeRefundId = stripeRefund?.id || null;
    refund.processedBy = adminId;
    refund.processedAt = new Date();
    refund.status =
      refundAmount >= refund.amount ? "refunded_full" : "refunded_partial";
    await refund.save({ session });

    // Update payment & order
    payment.status = refundAmount >= payment.amount ? "refunded" : "paid";
    await payment.save({ session });
    const order = await Order.findById(refund.order).session(session);
    if (order) {
      if (refundAmount >= payment.amount) {
        order.paymentStatus = "refunded";
        order.status = "canceled";
      }
      await order.save({ session });
    }

    // Adjust seller wallets: reduce reserved amounts proportionally
    const breakdown = payment.metadata?.sellerBreakdown || [];
    const ratio = payment.amount ? refundAmount / payment.amount : 0;
    for (const b of breakdown) {
      const sellerId = b.sellerId;
      const reduceAmount = +(b.gross * ratio).toFixed(2);

      const wallet = await Wallet.findOne({ user: sellerId }).session(session);
      if (!wallet) continue;

      const before = wallet.reserved || 0;
      wallet.reserved = Math.max(0, (wallet.reserved || 0) - reduceAmount);
      await wallet.save({ session });

      await Transaction.create(
        [
          {
            transactionId: `${refund._id.toString()}-refund-${sellerId}`,
            type: "refund",
            wallet: wallet._id,
            user: sellerId,
            order: refund.order,
            payment: payment._id,
            amount: reduceAmount,
            currency: payment.currency || "USD",
            balanceBefore: before,
            balanceAfter: wallet.reserved,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return res.json({ message: "Refund processed", refund, stripeRefund });
  } catch (err) {
    console.error("reviewRefund error", err);
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Failed to process refund", error: err.message });
  }
};

export default { listRefunds, reviewRefund };
