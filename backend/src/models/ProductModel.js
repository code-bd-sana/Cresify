import mongoose, { Schema } from "mongoose";
import User from "./UserModel.js";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is Required"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: [true, "Seller is Required"],
    },
    category: {
      type: String,
      required: [true, "Category is Required"],
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    location: String,

    stock: {
      type: Number,
      required: [true, "Stock Quantity is Required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "out-of-stock", "ubpublish", "rejected", "pending", "unpublish"],
      default: "pending",
    },

    description: String,
    country:String,
    region:String,
    city:String,
      shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: String,
    // Shipping configuration per product
 
  },
  { timestamps: true }
);

productSchema.index({ status: 1, stock: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
