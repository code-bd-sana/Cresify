import mongoose, { Schema } from "mongoose";

const walletLedgerSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      default: null,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      default: null,
    },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: {
      type: String,
      enum: ["sale", "refund", "payout", "service_sale"],
      required: true,
    },
    refId: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

// `user` has `unique: true` in the schema which creates an index already.
// Avoid duplicate single-field index declarations.

const WalletLedger = mongoose.model("WalletLedger", walletLedgerSchema);
export default WalletLedger;
