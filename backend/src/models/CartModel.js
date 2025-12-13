import mongoose, { Schema } from "mongoose";
import Product from "./ProductModel.js";
import User from "./UserModel.js";

const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  count: {
    type: Number,
  },
});

cartSchema.index({ user: 1 });
cartSchema.index({ user: 1, product: 1 });

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
