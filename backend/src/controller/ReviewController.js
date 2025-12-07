import Review from "../models/ReviewModel.js";

export const saveReview = async(req, res)=>{
    try {

        const data = req.body;

        const newReview = new Review(data);
        const saved = await newReview.save();
        res.status(200).json({
            message:"Success",
            data:saved
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
}


export const deleteReview = async(req, res)=>{
    try {
      const id = req.params.id;
      const deleted = await Review.deleteOne({_id:id});
      res.status(200).json({
        message:"Success",
        data:deleted
      })

        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
};

export const postReview = async(req, res)=>{
    try {
        const {id, reply} = req.body;
        const udpated = await Review.updateOne({
            _id:id
        }, {$set:{
            reply:reply
        }});


        res.status(200).json({
            message:'Success',
            data:udpated
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
 
    }
}