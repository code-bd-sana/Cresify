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
    // Stripe-connected account information for sellers/providers
    stripeAccountId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    // whether connected account can receive payouts
    stripePayoutsEnabled: { type: Boolean, default: false },
    // whether connected account can accept charges
    stripeChargesEnabled: { type: Boolean, default: false },
    // store raw Stripe account details if needed for diagnostics
    stripeDetails: { type: Schema.Types.Mixed, default: {} },
    // timestamp of last successful payout to this wallet
    lastPayoutAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// `user` has `unique: true` in the schema which creates an index already.
// Avoid duplicate single-field index declarations.

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
