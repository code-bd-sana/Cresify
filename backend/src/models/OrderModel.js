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

/* 🔑 Auto-generate orderId before validation so validators pass */
orderSchema.pre("validate", function () {
  if (this.orderId) return;

  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  this.orderId = `ORD-${ymd}-${random}`;
});

/* Indexes */
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
