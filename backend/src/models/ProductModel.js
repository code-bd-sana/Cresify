import mongoose, { Schema } from "mongoose";
import User from "./UserModel.js";

const productSchema = new Schema({


    name:{
        type:String,
        required:[true, "Product Name is Required"]
    }, 
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User,
        required:[true, "Seller is Required"]
    },
    category:{
        type:String,
        required:[true, "Category is Required"]
    },
    price:{
        type:Number,
        required:[true, "Price is Required"]
    },

    stock:{
        type:Number,
        required:[true, "Stock Quantity is Requried"]
    },

    status:{
        type:String,
        enum:['active', 'out-of-stock', "ubpublish"]
    },

    description:String,
    image:String,

}, {timestamps:true}) ;



const Product = mongoose.model("Product", productSchema);

export default Product;