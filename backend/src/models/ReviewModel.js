import mongoose, { Schema } from "mongoose";
import User from "./UserModel.js";
import Product from "./ProductModel.js";

const ReviewSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:[true, "User is Required"]
    },
    rating:Number,
    review:String,
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product,

    },


    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:[true, "Provider is Requried"]
    },
    reply:String

}, {timestamps:true});


const Review = mongoose.model("review", ReviewSchema);

export default Review;