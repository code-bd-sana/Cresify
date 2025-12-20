import mongoose from "mongoose";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import User from "../../models/UserModel.js";

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
    const { sellerId, search = "", page = 1, limit = 10 } = req.query;

    // Validation
    if (!sellerId) {
      return res.status(400).json({ message: "sellerId is required" });
    }

    // Find user and role
    const user = await User.findOne({ _id: sellerId });
    const role = user?.role;
    console.log(role, "user role");

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;
    const searchRegex = search ? new RegExp(search.trim(), "i") : null;

    const pipeline = [
      /**
       * 1️. Seller isolation (only if role is NOT admin)
       */
      ...(role !== "admin"
        ? [
            {
              $match: {
                seller: sellerObjectId,
              },
            },
          ]
        : []),

      /**
       * 2️. Join Order
       */
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },

      /**
       * 3️. Join Customer
       */
      {
        $lookup: {
          from: "users",
          localField: "order.customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      /**
       * 4️. Join Seller (add seller info)
       */
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "sellerInfo",
        },
      },
      { $unwind: "$sellerInfo" },

      /**
       * 5️. Search filter (Order ID OR Customer Name)
       */
      ...(searchRegex
        ? [
            {
              $match: {
                $or: [
                  { "order._id": { $regex: searchRegex } },
                  { "customer.name": { $regex: searchRegex } },
                  { "sellerInfo.name": { $regex: searchRegex } }, // optional search by seller name
                ],
              },
            },
          ]
        : []),

      /**
       * 6️. Sort latest first
       */
      { $sort: { createdAt: -1 } },

      /**
       * 7️. Pagination + total count
       */
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                _id: 1,
                orderId: "$order._id",
                orderDate: "$order.createdAt",

                customer: {
                  _id: "$customer._id",
                  name: "$customer.name",
                  email: "$customer.email",
                  phoneNumber: "$customer.phoneNumber",
                  image: "$customer.image",
                },

                seller: {
                  _id: "$sellerInfo._id",
                  name: "$sellerInfo.name",
                  email: "$sellerInfo.email",
                  phoneNumber: "$sellerInfo.phoneNumber",
                  image: "$sellerInfo.image",
                },

                products: 1,
                amount: 1,
                commission: 1,
                netAmount: 1,
                status: 1,
                paymentStatus: "$order.paymentStatus",
                paymentMethod: "$order.paymentMethod",
                address: "$order.address",
                createdAt: 1,
              },
            },
          ],
        },
      },
    ];

    const result = await OrderVendorModel.aggregate(pipeline);

    const orders = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    return res.status(200).json({
      message: "Seller orders fetched successfully",
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
      message: "Failed to fetch seller orders",
      error: error.message,
    });
  }
};



export const orderStatusUpdate = async (req, res) => {
  console.log(req.body, "asoasdf sohn g");
  try {
    const { status, id } = req.body;
    const updated = await OrderVendorModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: status,
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: updated,
    });
  } catch (error) {
    console.log(error, "this is error kawa");
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

// Backend controller
export const paymentHistory = async (req, res) => {

  
  try {

    const id = req.params.id
    const { sellerId, page = 0, limit = 10, search = "" } = req.query;
    
    const skip = page * limit;

    const user =await User.findOne({_id:id});


    // Build query
    let query = {};


    if(user.role === 'seller'){
      query.seller = id
    }
    if (sellerId) query.seller = sellerId;
    
    // Add search functionality
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await OrderVendorModel.countDocuments(query);

    // Get paginated results
    const result = await OrderVendorModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      message: "Success",
      data: result,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message
    });
  }
};