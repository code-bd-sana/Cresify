import mongoose, { Schema } from "mongoose";

const walletLedgerSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

// Note: do not add `unique: true` on ledger owner fields —
// ledgers are many-per-user. Keep fields non-unique to allow multiple entries.

const WalletLedger = mongoose.model("WalletLedger", walletLedgerSchema);
export default WalletLedger;
