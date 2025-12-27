import mongoose, { Schema } from "mongoose";

const evidenceSchema = new Schema(
  {
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
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
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    // If refund is for a specific vendor's part of an order
    orderVendor: { type: Schema.Types.ObjectId, ref: "OrderVendor" },

    // Seller responsible for the refunded item(s)
    seller: { type: Schema.Types.ObjectId, ref: "User" },

    // Provider (for service bookings) - may differ from `seller`/vendor
    provider: { type: Schema.Types.ObjectId, ref: "User" },

    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Refund total amount (sum of refunded items + related shipping + taxes)
    amount: { type: Number, required: true, min: 0 },
    // Breakdown of items being refunded (supports partial-order refunds)
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number },
        amount: { type: Number },
        // Shipping portion to refund for this item
        shippingAmount: { type: Number, default: 0 },
        // Tax portion to refund for this item
        taxAmount: { type: Number, default: 0 },
      },
    ],
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
    sellerNotes: { type: String },
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
