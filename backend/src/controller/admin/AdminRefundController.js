import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";
import Refund from "../../models/RefundModel.js";

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

    return res.json({ message: "Refund processed", refund, stripeRefund });
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
