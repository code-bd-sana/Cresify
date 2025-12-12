import short from "short-uuid";
import Cart from "../../models/CartModel.js";
import Order from "../../models/OrderModel.js";
import Product from "../../models/ProductModel.js";

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
  const session = await mongoose.startSession();

  try {
    const { userId, address, paymentMethod } = req.body;

    // Validate input
    if (!userId || !address?.street || !address?.city || !address?.country) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    session.startTransaction();

    // PURE AGGREGATION: Get cart + valid products + calculate total in DB
    const cartAggregation = await Cart.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "productDetails.status": "active",
          "productDetails.stock": { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$productDetails.price" },
          itemCount: { $sum: 1 },
          productIds: { $push: "$productDetails._id" },
          cartItemIds: { $push: "$_id" }, // to delete cart later
        },
      },
    ]).session(session);

    if (!cartAggregation.length || cartAggregation[0].itemCount === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Your cart is empty or contains unavailable products",
      });
    }

    const { totalAmount, itemCount, productIds } = cartAggregation[0];

    // Atomic stock decrement — prevents race condition
    const stockResult = await Product.updateMany(
      {
        _id: { $in: productIds },
        stock: { $gt: 0 },
      },
      { $inc: { stock: -1 } },
      { session }
    );

    if (stockResult.modifiedCount !== productIds.length) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Some items went out of stock. Please try again.",
      });
    }

    // Generate short unique order ID
    const orderId = translator.new();

    // Create order
    const [order] = await Order.create(
      [
        {
          orderId,
          customer: userId,
          products: productIds,
          item: itemCount,
          amount: totalAmount,
          address,
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
          status: "processing",
        },
      ],
      { session }
    );

    // Clear cart
    await Cart.deleteMany(
      { user: new mongoose.Types.ObjectId(userId) },
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      message: "Order placed successfully!",
      order: {
        orderId: order.orderId,
        amount: order.amount,
        items: order.item,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Place order failed:", error);
    return res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
