import mongoose, { Schema } from "mongoose";
import User from "./UserModel.js";
import Product from "./ProductModel.js";

const cartSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product,
        required:true
    },
    count:{
        type:Number
    }

});



const Cart = mongoose.model("cart", cartSchema);
export default Cart;