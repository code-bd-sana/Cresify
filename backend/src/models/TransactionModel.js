import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["credit", "debit", "hold", "release", "payout", "refund", "fee"],
      required: true,
    },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    order: { type: Schema.Types.ObjectId, ref: "order" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    amount: { type: Number},
    currency: { type: String, default: "usd" },
    balanceBefore: { type: Number },
    balanceAfter: { type: Number },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// `transactionId` is declared with `unique: true` above which creates an index.
// Avoid declaring the same single-field index again to prevent duplicate-index warnings.
transactionSchema.index({ user: 1, wallet: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
