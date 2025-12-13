import mongoose, { Schema } from "mongoose";

const payoutSchema = new Schema(
  {
    payoutId: { type: String, required: true, unique: true, trim: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "queued", "in_transit", "paid", "failed"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["manual", "stripe_connect", "bank_transfer"],
      default: "manual",
    },
    items: [{ type: Schema.Types.ObjectId, ref: "order" }],
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    stripeTransferId: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

payoutSchema.index({ seller: 1, status: 1, createdAt: -1 });

const Payout = mongoose.model("Payout", payoutSchema);
export default Payout;
