import Order from "../models/OrderModel.js";

export const saveOrder = async(req, res)=>{
    try {

        const data = req.body;
        console.log(data, "Hey daa ki abosta");
        const newOrder = new Order(data);
        const saved = await newOrder.save();

         console.log(saved), "save hoisot???";
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
};



export const  editStatus = async(req, res)=>{
    try {

        const data = req.body;
        const {id, status}= data;

    

        const updated = await Order.updateOne({
            _id:id
        }, {$set:{
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