import Product from "../../models/ProductModel.js";

/**
 * @function getAllProducts
 * @description Retrieves all products from the database with pagination, search, and category filter.
 *              Allows searching by product name or seller name efficiently using aggregation.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @query search - Search by product name or seller name (optional)
 * @query category - Filter products by category (optional)
 * @query skip - Number of records to skip for pagination (default: 0)
 * @query limit - Number of records to return (default: 10)
 * @route GET /admin/products
 * @access Admin
 */
export const getAllProducts = async (req, res) => {
  try {
    const { search = "", category = "", skip = 0, limit = 10 } = req.query;

    // Build match stage for aggregation
    const matchStage = {};
    if (category) matchStage.category = category;

    if (search) {
      // Use $lookup and $regex to search in both product name and seller name
      matchStage.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: "users", // collection name for User model
          localField: "seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { "seller.name": { $regex: search, $options: "i" } },
                ],
                ...(category ? { category } : {}),
              },
            },
          ]
        : category
        ? [{ $match: { category } }]
        : []),
      { $sort: { createdAt: -1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          price: 1,
          stock: 1,
          status: 1,
          image: 1,
          description: 1,
          seller: { _id: 1, name: 1, email: 1 },
          createdAt: 1,
        },
      },
    ];

    const products = await Product.aggregate(aggregationPipeline);

    // Get total count (without skip/limit)
    const countPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { "seller.name": { $regex: search, $options: "i" } },
                ],
                ...(category ? { category } : {}),
              },
            },
          ]
        : category
        ? [{ $match: { category } }]
        : []),
      { $count: "total" },
    ];

    const totalResult = await Product.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: products,
      total,
      skip: Number(skip) || 0,
      limit: Number(limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

/**
 * @function adminProductOverview
 * @description Retrieves an overview of products in the system.
 *              Returns the total number of products, the number of active products,
 *              and the number of rejected products.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @route GET /admin/products/overview
 * @access Admin
 */
export const adminProductOverview = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: "active" });
    const pendingProducts = await Product.countDocuments({ status: "pending" });
    const rejectedProducts = await Product.countDocuments({
      status: "rejected",
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        rejectedProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product overview",
      error: error.message,
    });
  }
};

/**
 * @function changeProductStatus
 * @description Updates the status of a product (active or rejected) and returns it in paginated product format.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @params id - Product ID
 * @body status - New status (active or rejected)
 * @route PUT /admin/products/status/:id
 * @access Admin
 */
export const changeProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("seller", "name email");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Format the product as in pagination
    const formattedProduct = {
      _id: updatedProduct._id,
      name: updatedProduct.name,
      category: updatedProduct.category,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      status: updatedProduct.status,
      image: updatedProduct.image,
      description: updatedProduct.description,
      seller: updatedProduct.seller
        ? {
            _id: updatedProduct.seller._id,
            name: updatedProduct.seller.name,
            email: updatedProduct.seller.email,
          }
        : null,
      createdAt: updatedProduct.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: formattedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product status",
      error: error.message,
    });
  }
};
