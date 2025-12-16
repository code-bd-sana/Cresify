import mongoose, { Schema } from "mongoose";

const orderVendorSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    commission: {
      type: Number,
      required: true,
      min: 0,
    },

    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipping", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }l
);

/* Indexes */
orderVendorSchema.index({ seller: 1, createdAt: -1 });
orderVendorSchema.index({ order: 1 });

export default mongoose.model("OrderVendor", orderVendorSchema);
