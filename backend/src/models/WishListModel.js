import mongoose, { Schema } from "mongoose";

export const WishListModel = new Schema({
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
});



const WishList = mongoose.model("wishList", WishListModel);
export default WishList;