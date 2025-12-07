import Product from "../models/ProductModel.js";

export const saveProduct = async(req, res)=>{
    try {


        const data = req.body;

        const newProduct = new Product(data);

        const saved = await newProduct.save();

        res.status(200).json({
            message:"Success",
            data:saved
        });


        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
};



export const deleteProduct = async(req, res)=>{
    try {

        const id = req.params.id;

        const deleted = await Product.deleteOne({
            _id:id
        });


        res.status(201).json({
            message:'Success',
            data:deleted
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message

        })
    }
};



export const editProduct = async(req, res)=>{
    try {

        const data = req.body;
        const id = req.params.id;
        const updated = await Product.updateOne({_id:id}, {$set:{

            name:data?.name,
            category:data?.category,
            price:data?.price,
            stock:data?.stock,
            description:data?.description,
            status: data?.status 
                    
             


        }}) ;



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