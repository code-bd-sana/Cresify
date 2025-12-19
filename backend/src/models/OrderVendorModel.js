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
        // Unit price for this product
        price: { type: Number, required: true },
        // total amount for this product (price * quantity)
        amount: { type: Number, required: true },
        // Tax for this product (amount), and taxRate applied (e.g., VAT %)
        taxRate: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        // Shipping portion attributable to this product (if seller charges per product)
        shippingAmount: { type: Number, default: 0 },
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Shipping total for this vendor (sum of shipping for vendor's products)
    shippingAmount: { type: Number, default: 0, min: 0 },

    // Commission snapshot (platform commission on product subtotal only, percentage and amounts)
    commissionPercentage: { type: Number, default: 0 },
    commissionAmount: { type: Number, default: 0, min: 0 },

    // VAT applied on commission (stored so it is NOT shown to buyer but visible in seller reports)
    commissionVATRate: { type: Number, default: 0 },
    commissionVATAmount: { type: Number, default: 0, min: 0 },

    // Total commission charged (commissionAmount + commissionVATAmount)
    commissionTotal: { type: Number, default: 0, min: 0 },

    // Amount payable to seller after commission and shipping (snapshot)
    sellerPayout: { type: Number, default: 0, min: 0 },

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
