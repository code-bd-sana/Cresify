import mongoose from "mongoose";
import Order from "../../models/OrderModel.js";

/**
 * Get orders for a seller with pagination and search by order ID or customer name.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.sellerId - Seller's user ID
 * @param {string} [req.query.search] - Optional search text (orderId or customer name)
 * @param {number} [req.query.page=1] - Page number
 * @param {number} [req.query.limit=10] - Items per page
 * @param {Object} res - Express response object
 */
export const getSellerOrders = async (req, res) => {
  try {
    const { sellerId, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    const searchRegex = search ? new RegExp(search, "i") : null;

    const pipeline = [
      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      // Filter orders that include at least one product from this seller
      {
        $match: {
          "productDetails.seller": sellerObjectId,
        },
      },
      // Lookup customer info
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },
      // Apply search filter if provided
      ...(searchRegex
        ? [
            {
              $match: {
                $or: [
                  { orderId: searchRegex },
                  { "customerDetails.name": searchRegex },
                ],
              },
            },
          ]
        : []),
      // Facet for pagination + total count
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ["$metadata.total", 0] },
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    const orders = result[0]?.data || [];
    const total = result[0]?.total || 0;

    res.status(200).json({
      message: "Success",
      data: orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        amount: order.amount,
        item: order.item,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        customer: {
          _id: order.customerDetails._id,
          name: order.customerDetails.name,
          email: order.customerDetails.email,
        },
        products: order.productDetails,
      })),
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error("Get seller orders error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
