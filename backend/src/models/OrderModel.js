import mongoose, { Schema } from "mongoose";
import Product from "./ProductModel.js";
import User from "./UserModel.js";
// orderschema

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        required: true,
      },
    ],
    item: {
      type: Number,
      required: [true, "Item is Required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is Required"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      fullName: String,
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
    },
    status: {
      type: String,
      default: "pending",
      enum: ["delivered", "canceled", "shipping", "processing"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is Required"],
      enum: ["cod", "card"],
    },
    paymentStatus: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
