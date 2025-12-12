import short from "short-uuid";
import Order from "../../models/OrderModel.js";
import Product from "../../models/ProductModel.js";
import mongoose from "mongoose";

// Generate a short, Base58-encoded UUID immediately:
short.generate(); // 73WakrfVbNJBaAmhQtEeDv

// Or create a translator and generate using its method:
const translator = short.createTranslator(); // Default is flickrBase58
const orderId = translator.generate(); // mhvXdrZT4jP5T8vBxuvm75

/**
 * Place an order for selected products by a user.
 * Calculates total items and total amount using Mongoose aggregation.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Payload containing order details
 * @param {string} req.body.userId - The ID of the user placing the order
 * @param {Array<string>} req.body.productIds - Array of selected product IDs
 * @param {Object} req.body.address - Shipping address for the order
 * @param {string} req.body.paymentMethod - Payment method (cod/card)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with order info
 */
export const placeOrder = async (req, res) => {
  try {
    const { userId, productIds, address, paymentMethod } = req.body;

    // Validate required fields
    if (
      !userId ||
      !productIds ||
      !Array.isArray(productIds) ||
      productIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "User ID and selected products are required" });
    }

    if (!address || !address.street || !address.city || !address.country) {
      return res
        .status(400)
        .json({ message: "Complete shipping address is required" });
    }

    if (!paymentMethod || !["cod", "card"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ message: "Valid payment method is required" });
    }

    // Use aggregation to fetch products and calculate total items and total amount
    const productAggregation = await Product.aggregate([
      {
        $match: {
          _id: { $in: productIds.map((id) => new mongoose.Types.ObjectId(id)) },
          status: "active",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
          itemCount: { $sum: 1 },
          products: { $push: "$_id" },
        },
      },
    ]);

    if (!productAggregation.length) {
      return res
        .status(404)
        .json({ message: "No valid products found for the order" });
    }

    const { totalAmount, itemCount, products } = productAggregation[0];

    // Create new order
    const newOrder = new Order({
      orderId,
      customer: userId,
      products,
      item: itemCount,
      amount: totalAmount,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      status: "processing",
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
