import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderVendors: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderVendor",
        required: true,
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      fullName: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      postalCode: String,
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

/* Indexes */
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);

/**
 * Generate unique order ID after order creation
 */
orderSchema.post("save", async function (doc) {
  if (!doc.orderId) {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${year}-${random}`;
    doc.orderId = orderId;
    await doc.save();
  }
});
