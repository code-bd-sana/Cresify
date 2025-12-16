import mongoose, { Schema } from "mongoose";

const evidenceSchema = new Schema(
  {
    type: { type: String },
    url: { type: String },
    note: { type: String },
  },
  { _id: false }
);

const refundSchema = new Schema(
  {
    refundId: { type: String, trim: true }, // Stripe refund ID once processed
    payment: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    order: { type: Schema.Types.ObjectId, ref: "order", required: true },

    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "usd" },
    reason: { type: String },
    evidence: [evidenceSchema],
    status: {
      type: String,
      enum: [
        "requested",
        "under_review",
        "approved",
        "partial_refunded",
        "rejected",
        "refunded_full",
        "refunded_partial",
      ],
      default: "requested",
    },
    adminNotes: { type: String },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    processedAt: { type: Date },
    stripeRefundId: { type: String },
  },
  { timestamps: true }
);

refundSchema.index({ payment: 1, order: 1, status: 1 });

const Refund = mongoose.model("Refund", refundSchema);
export default Refund;
