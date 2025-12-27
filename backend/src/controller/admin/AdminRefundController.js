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
import { toTwo } from "../../utils/money.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

/**
 * List all seller refunds (admin) with pagination
 * Query params: page, limit
 *
 * Returns paginated refunds
 */
export const listSellerRefunds = async (req, res) => {
  try {
    // Parse query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        message: "Page must be a positive integer",
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Limit must be between 1 and 100",
      });
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Refund.countDocuments();

    // Fetch paginated refunds of sellers only
    const refunds = await Refund.find({
      seller: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("requestedBy processedBy seller order payment");
    return res.json({
      refunds,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to list refunds",
    });
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
        refund.processedBy = new mongoose.Types.ObjectId(adminId);
        refund.processedAt = new Date();
        await refund.save({ session });
        return res.json({ message: "Refund rejected", refund });
      }

      const payment = await Payment.findById(refund.payment).session(session);
      const order = await Order.findById(refund.order).session(session);
      if (!payment || !order) throw new Error("Payment or order not found");

      const refundAmount = toTwo(refund.amount);

      let stripeRefund = null;
      // Only attempt Stripe refund when payment was via Stripe or has a Stripe id
      if (
        payment.method === "stripe_checkout" ||
        payment.paymentId ||
        payment.metadata?.stripePaymentIntent ||
        payment.stripeSessionId ||
        payment.metadata?.stripeCharge
      ) {
        try {
          const refundParams = { amount: Math.round(refundAmount * 100) };

          // Prefer explicit paymentId on record
          if (payment.paymentId) {
            const pid = String(payment.paymentId);
            if (pid.startsWith("pi_")) refundParams.payment_intent = pid;
            else refundParams.charge = pid;
          } else if (payment.metadata?.stripePaymentIntent) {
            refundParams.payment_intent = String(
              payment.metadata.stripePaymentIntent
            );
          } else if (payment.metadata?.stripeCharge) {
            refundParams.charge = String(payment.metadata.stripeCharge);
          } else if (payment.stripeSessionId || payment.stripeSession) {
            const sessId = payment.stripeSessionId || payment.stripeSession;
            try {
              const session = await stripe.checkout.sessions.retrieve(sessId, {
                expand: ["payment_intent"],
              });
              if (session && session.payment_intent) {
                const pi =
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent.id;
                if (pi) refundParams.payment_intent = pi;
              }
            } catch (e) {
              console.error(
                "Failed to retrieve checkout session",
                e?.message || e
              );
            }
          }

          if (!refundParams.payment_intent && !refundParams.charge) {
            throw new Error(
              "Missing payment identifier for stripe refund (payment_intent or charge)"
            );
          }

          stripeRefund = await stripe.refunds.create(refundParams);
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
      refund.processedBy = new mongoose.Types.ObjectId(adminId);
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
          const desiredDeduct = toTwo(net * ratio);

          const wallet = walletByUser.get(
            sellerId?.toString ? sellerId.toString() : String(sellerId)
          );
          if (!wallet) continue;

          const beforeReserved = toTwo(wallet.reserved || 0);
          const beforeCurrent = toTwo(wallet.currentBalance || 0);

          // Deduct from reserved first
          const deductFromReserved = toTwo(
            Math.min(beforeReserved, desiredDeduct)
          );
          const remaining = toTwo(
            Math.max(0, desiredDeduct - deductFromReserved)
          );

          const newReserved = toTwo(beforeReserved - deductFromReserved);
          const newCurrent = toTwo(beforeCurrent - remaining); // may become negative

          walletBulkOps.push({
            updateOne: {
              filter: { _id: wallet._id },
              update: {
                $set: { reserved: newReserved, currentBalance: newCurrent },
              },
            },
          });

          // ledger entries: debit reserved portion and debit current portion (if any)
          if (deductFromReserved > 0 && sellerId) {
            ledgerDocs.push({
              seller: sellerId,
              type: "debit",
              amount: toTwo(deductFromReserved),
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
              amount: toTwo(deductFromReserved),
              currency: payment.currency,
              balanceBefore: beforeReserved,
              balanceAfter: newReserved,
            });
          }

          if (remaining > 0) {
            if (sellerId) {
              ledgerDocs.push({
                seller: sellerId,
                type: "debit",
                amount: toTwo(remaining),
                reason: "refund",
                refId: order._id,
              });
            }

            txDocs.push({
              transactionId: `${
                payment._id
              }-refund-${sellerId}-curr-${Date.now()}`,
              type: "refund",
              wallet: wallet._id,
              user: sellerId,
              order: order._id,
              payment: payment._id,
              amount: toTwo(remaining),
              currency: payment.currency,
              balanceBefore: beforeCurrent,
              balanceAfter: newCurrent,
            });
          }

          // Handle stripe fees allocation if seller absorbs fees
          if (feePolicy === "seller" && totalStripeFee > 0) {
            const sellerShareFee = toTwo(
              (totalStripeFee * (net || 0)) / totalNet
            );
            // Deduct sellerShareFee from currentBalance
            const beforeCurr = newCurrent;
            const afterCurr = beforeCurr - sellerShareFee;

            walletBulkOps.push({
              updateOne: {
                filter: { _id: wallet._id },
                update: { $set: { currentBalance: afterCurr } },
              },
            });

            if (sellerId) {
              ledgerDocs.push({
                seller: sellerId,
                type: "debit",
                amount: toTwo(sellerShareFee),
                reason: "refund_fee",
                refId: order._id,
              });
            }

            txDocs.push({
              transactionId: `${
                payment._id
              }-refund-fee-${sellerId}-${Date.now()}`,
              type: "fee",
              wallet: wallet._id,
              user: sellerId,
              order: order._id,
              payment: payment._id,
              amount: toTwo(sellerShareFee),
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
              const amountDeduct = toTwo((ov.amount || 0) * ratio);
              const shippingDeduct = toTwo((ov.shippingAmount || 0) * ratio);
              const commissionDeduct = toTwo(
                (ov.commissionAmount || 0) * ratio
              );
              const commissionVATDeduct = toTwo(
                (ov.commissionVATAmount || 0) * ratio
              );

              ov.amount = toTwo(
                Math.max(0, toTwo((ov.amount || 0) - amountDeduct))
              );
              ov.shippingAmount = toTwo(
                Math.max(0, toTwo((ov.shippingAmount || 0) - shippingDeduct))
              );
              ov.commissionAmount = toTwo(
                Math.max(
                  0,
                  toTwo((ov.commissionAmount || 0) - commissionDeduct)
                )
              );
              ov.commissionVATAmount = toTwo(
                Math.max(
                  0,
                  toTwo((ov.commissionVATAmount || 0) - commissionVATDeduct)
                )
              );
              ov.commissionTotal = toTwo(
                Math.max(
                  0,
                  toTwo(
                    (ov.commissionTotal || 0) -
                      toTwo(commissionDeduct + commissionVATDeduct)
                  )
                )
              );
              ov.sellerPayout = toTwo(
                Math.max(
                  -9999999, // allow negative payouts (Nine million, Ninety-nine thousand, nine hundred ninety-nine!)
                  toTwo(
                    (ov.sellerPayout || 0) -
                      toTwo(
                        amountDeduct +
                          shippingDeduct -
                          (commissionDeduct + commissionVATDeduct)
                      )
                  )
                )
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

/**
 * Get refund detail for admin
 *
 * params: { id }
 */
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

/**
 * Admin review for provider/service refunds.
 * body: { refundId, action: 'approve'|'reject'|'process', adminId }
 */
export const reviewServiceRefund = async (req, res) => {
  const { refundId, action, adminId } = req.body;
  if (!refundId || !action || !adminId)
    return res.status(400).json({ message: "Missing fields" });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const refund = await Refund.findById(refundId)
        .populate("requestedBy processedBy provider evidence.uploadedBy")
        .session(session);
      if (!refund) throw new Error("Refund not found");
      if (!refund.provider)
        return res.status(400).json({ message: "Not a provider refund" });

      if (action === "reject") {
        refund.status = "rejected";
        refund.processedBy = new mongoose.Types.ObjectId(adminId);
        refund.processedAt = new Date();
        await refund.save({ session });
        return res.json({ message: "Refund rejected", refund });
      }

      // If action is approve without processing payment, just mark approved
      if (action === "approve") {
        refund.status = "approved";
        refund.processedBy = new mongoose.Types.ObjectId(adminId);
        refund.processedAt = new Date();
        await refund.save({ session });
        return res.json({
          message: "Refund approved (awaiting processing)",
          refund,
        });
      }

      // action === 'process' -> attempt to perform refund through payment provider (Stripe)
      const payment = refund.payment
        ? await Payment.findById(refund.payment).session(session)
        : null;

      let stripeRefund = null;
      const refundAmount = toTwo(refund.amount || 0);
      if (payment) {
        // attempt stripe refund similar to reviewRefund
        if (
          payment.method === "stripe_checkout" ||
          payment.paymentId ||
          payment.metadata?.stripePaymentIntent ||
          payment.stripeSessionId ||
          payment.metadata?.stripeCharge
        ) {
          try {
            const refundParams = { amount: Math.round(refundAmount * 100) };

            if (payment.paymentId) {
              const pid = String(payment.paymentId);
              if (pid.startsWith("pi_")) refundParams.payment_intent = pid;
              else refundParams.charge = pid;
            } else if (payment.metadata?.stripePaymentIntent) {
              refundParams.payment_intent = String(
                payment.metadata.stripePaymentIntent
              );
            } else if (payment.metadata?.stripeCharge) {
              refundParams.charge = String(payment.metadata.stripeCharge);
            } else if (payment.stripeSessionId || payment.stripeSession) {
              const sessId = payment.stripeSessionId || payment.stripeSession;
              try {
                const sess = await stripe.checkout.sessions.retrieve(sessId, {
                  expand: ["payment_intent"],
                });
                if (sess && sess.payment_intent) {
                  const pi =
                    typeof sess.payment_intent === "string"
                      ? sess.payment_intent
                      : sess.payment_intent.id;
                  if (pi) refundParams.payment_intent = pi;
                }
              } catch (e) {
                console.error(
                  "Failed to retrieve checkout session for service refund",
                  e?.message || e
                );
              }
            }

            if (!refundParams.payment_intent && !refundParams.charge) {
              throw new Error(
                "Missing payment identifier for stripe refund (payment_intent or charge)"
              );
            }

            stripeRefund = await stripe.refunds.create(refundParams);
            refund.refundId = stripeRefund.id;
            refund.stripeRefundId = stripeRefund.id;
          } catch (err) {
            console.error("Stripe service refund error", err);
            throw err;
          }
        }
      }

      // finalize refund status
      if (payment) {
        refund.status =
          refundAmount >= (payment.amount || 0)
            ? "refunded_full"
            : "refunded_partial";
        payment.refunds = payment.refunds || [];
        payment.refunds.push(refund._id);
        if (refund.status === "refunded_full") payment.status = "refunded";
        await payment.save({ session });
      } else {
        // no payment attached, mark as processed
        refund.status = "refunded_full";
      }

      // Adjust provider wallet: deduct from reserved first, then currentBalance
      try {
        if (refund.provider) {
          const providerId =
            refund.provider instanceof mongoose.Types.ObjectId
              ? refund.provider
              : new mongoose.Types.ObjectId(refund.provider);
          const wallet = await Wallet.findOne({ user: providerId }).session(
            session
          );
          if (wallet) {
            const beforeReserved = toTwo(wallet.reserved || 0);
            const beforeCurrent = toTwo(wallet.currentBalance || 0);
            const deductFromReserved = toTwo(
              Math.min(beforeReserved, refundAmount)
            );
            const remaining = toTwo(
              Math.max(0, refundAmount - deductFromReserved)
            );
            const newReserved = toTwo(beforeReserved - deductFromReserved);
            const newCurrent = toTwo(beforeCurrent - remaining);

            // Apply wallet update
            await Wallet.updateOne(
              { _id: wallet._id },
              { $set: { reserved: newReserved, currentBalance: newCurrent } },
              { session }
            );

            const ledgerDocs = [];
            const txDocs = [];

            if (deductFromReserved > 0) {
              ledgerDocs.push({
                provider: providerId,
                type: "debit",
                amount: toTwo(deductFromReserved),
                reason: "refund",
                refId: refund.order,
              });
              txDocs.push({
                transactionId: `${
                  refund._id
                }-refund-prov-${providerId}-${Date.now()}`,
                type: "refund",
                wallet: wallet._id,
                user: providerId,
                order: refund.order,
                payment: refund.payment,
                amount: toTwo(deductFromReserved),
                currency: refund.currency || "usd",
                balanceBefore: beforeReserved,
                balanceAfter: newReserved,
              });
            }

            if (remaining > 0) {
              ledgerDocs.push({
                provider: providerId,
                type: "debit",
                amount: toTwo(remaining),
                reason: "refund",
                refId: refund.order,
              });
              txDocs.push({
                transactionId: `${
                  refund._id
                }-refund-prov-curr-${providerId}-${Date.now()}`,
                type: "refund",
                wallet: wallet._id,
                user: providerId,
                order: refund.order,
                payment: refund.payment,
                amount: toTwo(remaining),
                currency: refund.currency || "usd",
                balanceBefore: beforeCurrent,
                balanceAfter: newCurrent,
              });
            }

            if (ledgerDocs.length)
              await WalletLedger.insertMany(ledgerDocs, { session });
            if (txDocs.length)
              await Transaction.insertMany(txDocs, { session });
          }
        }
      } catch (e) {
        console.error("Provider wallet adjustment failed", e.message || e);
        // continue — do not abort entire transaction for ledger write failures
      }

      refund.processedBy = new mongoose.Types.ObjectId(adminId);
      refund.processedAt = new Date();
      await refund.save({ session });

      return res.json({
        message: "Service refund processed",
        refund,
        stripeRefund,
      });
    });
  } catch (err) {
    console.error("reviewServiceRefund error", err);
    if (session.inTransaction && session.inTransaction())
      await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: "Failed to process service refund",
      error: err.message,
    });
  }
};
