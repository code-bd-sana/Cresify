import mongoose, { Schema } from "mongoose";

const orderVendorSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    orderId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
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
  { timestamps: true }
);

/* Indexes */
orderVendorSchema.index({ seller: 1, createdAt: -1 });
orderVendorSchema.index({ order: 1 });

export default mongoose.model("OrderVendor", orderVendorSchema);

/**
 * Generate unique vendor order ID after order creation
 */
orderVendorSchema.post("save", async function (doc) {
  if (!doc.orderId) {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    const orderId = `VORD-${year}-${random}`;
    doc.orderId = orderId;
    await doc.save();
  }
});
