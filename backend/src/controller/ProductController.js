import Product from "../models/ProductModel.js";

export const saveProduct = async (req, res) => {
  try {
    const data = req.body;

    const newProduct = new Product(data);

    const saved = await newProduct.save();

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Product.deleteOne({
      _id: id,
    });

    res.status(201).json({
      message: "Success",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const editProduct = async (req, res) => {


  try {
    const data = req.body;
    const id = data?.id;

    console.log(data, "hey data");
    const updated = await Product.updateOne(
      { _id: id },
      {
        $set: {
          name: data?.name,
          category: data?.category,
          price: data?.price,
          stock: data?.stock,
          description: data?.description,
          status: data?.status,
          image:data?.image
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const myProduct = async (req, res) => {
  console.log(req.query.search, "Search query received");
  try {
    const id = req.params.id;

    // Convert skip & limit to numbers + default values
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || ""; // get search from query

    console.log(skip, limit, "Skip and limit values");

    // Build the query
    const query = { seller: id };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];

      // Check if search term looks like an ObjectId or contains ID
      // Option 1: Search in _id as string
      if (search.length === 24 || /^[0-9a-fA-F]{24}$/.test(search)) {
        // If it looks like an ObjectId, search by _id directly
        try {
          const { ObjectId } = require("mongoose").Types;
          if (ObjectId.isValid(search)) {
            query.$or.push({ _id: new ObjectId(search) });
          }
        } catch (err) {
          console.log("Invalid ObjectId format");
        }
      } else {
        // Search in _id string representation
        query.$or.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: search,
              options: "i",
            },
          },
        });
      }
    }

    // Find products with pagination
    const allProducts = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Count total for frontend pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      message: "Success",
      total,
      skip,
      limit,
      data: allProducts,
    });
  } catch (error) {
    console.log(error, "Error in myProduct controller");
    res.status(500).json({
      message: error?.message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};





export const getSingleProduct = async(req, res)=>{
  try {
const id = req.params.id;
const product = await Product.findOne({_id:id});
res.status(200).json({
  message:"Success",
  data:product
})

    
  } catch (error) {
    res.status(500).json({
      error,
      message:error?.message
    })
  }
}