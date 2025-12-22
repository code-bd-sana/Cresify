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
        required:true
    },
    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,

    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,

    },
    
    reply:String
}, {timestamps:true});


// ⭐ Calculate average rating
ReviewSchema.statics.updateProductRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        { 
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                total: { $sum: 1 }
            }
        }
    ]);

    const avg = stats.length > 0 ? stats[0].avgRating : 0;

    await Product.findByIdAndUpdate(productId, {
        rating: avg
    });
};


// ⭐ Middleware: after save
ReviewSchema.post("save", async function () {
    await this.constructor.updateProductRating(this.product);
});

// ⭐ Middleware: after update
ReviewSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) await doc.constructor.updateProductRating(doc.product);
});

// ⭐ Middleware: after delete
ReviewSchema.post("findOneAndDelete", async function (doc) {
    if (doc) await doc.constructor.updateProductRating(doc.product);
});


const Review = mongoose.model("review", ReviewSchema);

export default Review;
