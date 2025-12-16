import mongoose, { Schema } from "mongoose";

/**
 * Evidence provided by user or admin
 * (images, documents, notes, etc.)
 */
const evidenceSchema = new Schema(
  {
    type: { type: String }, // image | pdf | text
    url: { type: String },
    note: { type: String },
  },
  { _id: false }
);

/**
 * Refund Schema
 *
 * Lifecycle:
 * decisionStatus:
 *   requested → under_review → approved / rejected
 *
 * refundStatus:
 *   pending → refunded_full / refunded_partial
 */
const refundSchema = new Schema(
  {
    /** Stripe refund ID (after processing) */
    stripeRefundId: { type: String, trim: true },

    /** Relations */
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /** Financials */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
    },

    /** Reason & Evidence */
    reason: { type: String },
    evidence: [evidenceSchema],

    /** Admin decision workflow */
    decisionStatus: {
      type: String,
      enum: ["requested", "under_review", "approved", "rejected"],
      default: "requested",
    },

    /** Stripe execution result */
    refundStatus: {
      type: String,
      enum: ["pending", "refunded_full", "refunded_partial"],
      default: "pending",
    },

    /** Admin processing */
    adminNotes: { type: String },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

/**
 * Indexes for fast lookup
 */
refundSchema.index({ payment: 1 });
refundSchema.index({ order: 1 });
refundSchema.index({ decisionStatus: 1, refundStatus: 1 });

const Refund = mongoose.model("Refund", refundSchema);
export default Refund;
