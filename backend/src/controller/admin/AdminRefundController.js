import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../../models/OrderModel.js";
import OrderVendor from "../../models/OrderVendorModel.js";
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
    const refunds = await Refund.find()
      .populate("requestedBy processedBy seller")
      .sort({ createdAt: -1 })
      .limit(100);
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
      const refund = await Refund.findById(refundId)
        .populate("requestedBy processedBy seller evidence.uploadedBy")
        .session(session);
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

        // compute total net to proportionally distribute potential stripe fees later
        const totalNet = sellers.reduce((s, x) => s + (x.net || 0), 0) || 1;

        // compute stripe fee (if any) and allocate per seller after refund created
        let totalStripeFee = 0;
        try {
          if (stripeRefund && stripeRefund.balance_transaction) {
            const bt = await stripe.balanceTransactions.retrieve(
              stripeRefund.balance_transaction
            );
            totalStripeFee = Math.abs(bt.fee || 0) / 100; // fee in cents
          }
        } catch (e) {
          // ignore fee retrieval errors
          totalStripeFee = 0;
        }

        const feePolicy = process.env.REFUND_STRIPE_FEES_POLICY || "platform";

        for (const b of sellers) {
          const { sellerId, net } = b;
          const desiredDeduct = net * ratio;

          const wallet = walletByUser.get(
            sellerId?.toString ? sellerId.toString() : String(sellerId)
          );
          if (!wallet) continue;

          const beforeReserved = wallet.reserved || 0;
          const beforeCurrent = wallet.currentBalance || 0;

          // Deduct from reserved first
          const deductFromReserved = Math.min(beforeReserved, desiredDeduct);
          const remaining = Math.max(0, desiredDeduct - deductFromReserved);

          const newReserved = beforeReserved - deductFromReserved;
          const newCurrent = beforeCurrent - remaining; // may become negative

          walletBulkOps.push({
            updateOne: {
              filter: { _id: wallet._id },
              update: {
                $set: { reserved: newReserved, currentBalance: newCurrent },
              },
            },
          });

          // ledger entries: debit reserved portion and debit current portion (if any)
          if (deductFromReserved > 0) {
            ledgerDocs.push({
              user: sellerId,
              type: "debit",
              amount: deductFromReserved,
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
              amount: deductFromReserved,
              currency: payment.currency,
              balanceBefore: beforeReserved,
              balanceAfter: newReserved,
            });
          }

          if (remaining > 0) {
            ledgerDocs.push({
              user: sellerId,
              type: "debit",
              amount: remaining,
              reason: "refund",
              refId: order._id,
            });

            txDocs.push({
              transactionId: `${
                payment._id
              }-refund-${sellerId}-curr-${Date.now()}`,
              type: "refund",
              wallet: wallet._id,
              user: sellerId,
              order: order._id,
              payment: payment._id,
              amount: remaining,
              currency: payment.currency,
              balanceBefore: beforeCurrent,
              balanceAfter: newCurrent,
            });
          }

          // Handle stripe fees allocation if seller absorbs fees
          if (feePolicy === "seller" && totalStripeFee > 0) {
            const sellerShareFee = (totalStripeFee * (net || 0)) / totalNet;
            // Deduct sellerShareFee from currentBalance
            const beforeCurr = newCurrent;
            const afterCurr = beforeCurr - sellerShareFee;

            walletBulkOps.push({
              updateOne: {
                filter: { _id: wallet._id },
                update: { $set: { currentBalance: afterCurr } },
              },
            });

            ledgerDocs.push({
              user: sellerId,
              type: "debit",
              amount: sellerShareFee,
              reason: "refund_fee",
              refId: order._id,
            });

            txDocs.push({
              transactionId: `${
                payment._id
              }-refund-fee-${sellerId}-${Date.now()}`,
              type: "fee",
              wallet: wallet._id,
              user: sellerId,
              order: order._id,
              payment: payment._id,
              amount: sellerShareFee,
              currency: payment.currency,
              balanceBefore: beforeCurr,
              balanceAfter: afterCurr,
            });
          }

          // Also update corresponding OrderVendor to reflect proportional reduction
          try {
            const ov = await OrderVendor.findOne({
              order: order._id,
              seller: sellerId,
            }).session(session);
            if (ov) {
              const amountDeduct = (ov.amount || 0) * ratio;
              const shippingDeduct = (ov.shippingAmount || 0) * ratio;
              const commissionDeduct = (ov.commissionAmount || 0) * ratio;
              const commissionVATDeduct = (ov.commissionVATAmount || 0) * ratio;

              ov.amount = Math.max(0, (ov.amount || 0) - amountDeduct);
              ov.shippingAmount = Math.max(
                0,
                (ov.shippingAmount || 0) - shippingDeduct
              );
              ov.commissionAmount = Math.max(
                0,
                (ov.commissionAmount || 0) - commissionDeduct
              );
              ov.commissionVATAmount = Math.max(
                0,
                (ov.commissionVATAmount || 0) - commissionVATDeduct
              );
              ov.commissionTotal = Math.max(
                0,
                (ov.commissionTotal || 0) -
                  (commissionDeduct + commissionVATDeduct)
              );
              ov.sellerPayout = Math.max(
                -9999999,
                (ov.sellerPayout || 0) -
                  (amountDeduct +
                    shippingDeduct -
                    (commissionDeduct + commissionVATDeduct))
              );
              await ov.save({ session });
            }
          } catch (e) {
            // ignore orderVendor update failures for now
            console.error("OrderVendor update failed", e.message);
          }
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

export const getRefund = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "refund id required" });

    const refund = await Refund.findById(id)
      .populate("order")
      .populate({
        path: "orderVendor",
        populate: { path: "seller", select: "name shopName shopLogo" },
      })
      .populate("payment")
      .populate("requestedBy")
      .populate("processedBy")
      .populate({ path: "items.product", select: "name price image" });

    if (!refund) return res.status(404).json({ message: "Refund not found" });

    return res.json({ refund });
  } catch (err) {
    console.error("getRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch refund", error: err.message });
  }
};
