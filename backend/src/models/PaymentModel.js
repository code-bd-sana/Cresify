import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "order" },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    provider: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "usd" },
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
    // Unique provider-side payment identifier (Stripe PaymentIntent id)
    paymentId: { type: String, unique: true, sparse: true, trim: true },
    capturedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
    refunds: [{ type: Schema.Types.ObjectId, ref: "Refund" }],
    // Commission snapshot for this payment (if applicable)
    commissionAmount: { type: Number, default: 0 },
    commissionVATAmount: { type: Number, default: 0 },
    commissionVATRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// `paymentId` is declared with `unique: true` above which creates an index.
// Avoid declaring the same single-field index again to prevent duplicate-index warnings.
paymentSchema.index({ order: 1, buyer: 1, seller: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
