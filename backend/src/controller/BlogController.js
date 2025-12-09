import Blog from "../models/BlogModel.js";

export const saveBlog = async(req, res)=>{
    try {

        const data = req.body;
        const newBlog = await Blog(data);
        const saved = newBlog.save();
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


 
export const deleteBlog = async(req, res)=>{
    try {
        
        const id = req.params.id;
        const deleted = await Blog.deleteOne({_id:id});

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

export const editBlog = async(req, res)=>{
    try {
        

        const data = req.body;
        const id  = data.id;
        const updated = Blog.updateOne({_id:id}, {$set:{
            img:data?.img,
            title: data?.title,
            category:data.category,
            description: data?.description,

        }});

        res.status(200).json({
            message:"Success",
            data:updated
        })
    } catch (error) {
           res.status(500).json({
            error,
            message:error?.message
        })
    }
};



export const getBlog = async(req, res)=>{
    try {
        

        const blogs = await Blog.find().sort(-1);
        res.status(200).json({
            message:"Success",
            data:blogs
        })

    } catch (error) {
           res.status(500).json({
            error,
            message:error?.message
        })
    }
}