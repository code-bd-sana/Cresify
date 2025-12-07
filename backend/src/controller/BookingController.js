import Booking from "../models/BookingModel.js";


export const saveBooking = async(req, res)=>{
    try {
        const data = req.body;
const newBooking = new Booking(data);
const saved = newBooking.save();
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


export const changeStatus = async(req, res)=>{
    try {
        

        const {id, status} = req.body;

        const updated = await Booking.updateOne({
            _id:id
        },{$set:{
            status:status
        }});

        res.status(200).json({
            message:"Success",
            data: updated
        })
    } catch (error) {
         res.status(500).json({
            error,
            message:error?.message
        })
    }
}