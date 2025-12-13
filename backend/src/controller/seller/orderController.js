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
    const { sellerId, search, page = 1, limit = 10 } = req.query;

    if (!sellerId) {
      return res.status(400).json({ message: "sellerId is required" });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10))); // max 100
    const skip = (pageNum - 1) * limitNum;

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    // Build search condition (indexed if you add text index)
    const searchCondition = search
      ? {
          $or: [
            { orderId: { $regex: search, $options: "i" } },
            { "customerDetails.name": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      // 1. Match orders that contain at least one product by this seller
      {
        $match: {
          "products": {
            $in: await Product.distinct("_id", { seller: sellerObjectId }),
          },
        },
      },

      // 2. Lookup customer (only needed fields)
      {
        $lookup: {
          from: "users",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
          pipeline: [
            { $project: { name: 1, email: 1, phoneNumber: 1, image: 1 } },
          ],
        },
      },
      { $unwind: "$customerDetails" },

      // 3. Lookup only seller's products in this order
      {
        $lookup: {
          from: "products",
          let: { productIds: "$products" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$productIds"] },
                seller: sellerObjectId,
                status: "active",
              },
            },
            {
              $project: {
                name: 1,
                price: 1,
                image: 1,
                category: 1,
              },
            },
          ],
          as: "sellerProducts",
        },
      },

      // 4. Search filter
      ...(Object.keys(searchCondition).length ? [{ $match: searchCondition }] : []),

      // 5. Sort newest first
      { $sort: { createdAt: -1 } },

      // 6. Facet for pagination + total count (single pass!)
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                orderId: 1,
                amount: 1,
                item: 1,
                status: 1,
                paymentMethod: 1,
                paymentStatus: 1,
                createdAt: 1,
                customer: "$customerDetails",
                products: "$sellerProducts", // only seller's products
              },
            },
          ],
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    const orders = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    return res.status(200).json({
      message: "Success",
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasMore: pageNum * limitNum < total,
      },
    });
  } catch (error) {
    console.error("getSellerOrders error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
