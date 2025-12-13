import mongoose, { Schema } from "mongoose";

const walletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    reserved: { type: Number, default: 0, min: 0 }, // funds on hold (escrow)
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

walletSchema.index({ user: 1 });

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
