import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    item: {
      type: Number,
      required: true,
      min: [1, "At least one item is required"],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      fullName: { type: String },
      country: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipping", "delivered", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "card"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ────────────────────────────── INDEXES (No Duplicates, Only Best Ones) ────────────── //

// 1. Most common query: get orders by customer (with latest first)
orderSchema.index({ customer: 1, createdAt: -1 });

// 2. Most common query: get orders containing a product (for seller dashboard)
orderSchema.index({ products: 1 });

// 3. Fast sorting by date (used in almost every list)
orderSchema.index({ createdAt: -1 });

// 4. (Optional but recommended) For seller orders via product lookup
orderSchema.index({ "products.seller": 1 }); // denormalize seller in future

// 5. (Optional) Text search on orderId
orderSchema.index({ orderId: "text" });

const Order = mongoose.model("order", orderSchema);

export default Order;
