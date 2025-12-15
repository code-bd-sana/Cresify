import mongoose, { Schema } from "mongoose";

const walletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentBalance: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    currency: { type: String, default: "usd" },
  },
  { timestamps: true }
);

// `user` has `unique: true` in the schema which creates an index already.
// Avoid duplicate single-field index declarations.

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
