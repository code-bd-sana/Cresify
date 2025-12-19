import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
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
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
