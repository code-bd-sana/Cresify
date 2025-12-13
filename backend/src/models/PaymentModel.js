import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    paymentId: { type: String, required: true, unique: true, trim: true }, // Stripe PaymentIntent / Session ID
    order: { type: Schema.Types.ObjectId, ref: "order", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["stripe_checkout", "card", "wallet"],
      default: "stripe_checkout",
    },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    capturedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
    refunds: [{ type: Schema.Types.ObjectId, ref: "Refund" }],
  },
  { timestamps: true }
);

paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ order: 1, buyer: 1, seller: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
