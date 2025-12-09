import WishList from "../../models/WishListModel.js";

export const addToWishList = async(req, res)=>{
    try {

        const data = req.body;
        const newWishList = new WishList(data);
        const saved = newWishList.save();

        res.status(200).json({
            message:"Success",
            data:saved
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            mesage:error?.mesage
        })
    }
}