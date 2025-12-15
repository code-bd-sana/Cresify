import dotenv from "dotenv";
import mongoose from "mongoose";
import short from "short-uuid";
import Stripe from "stripe";
import Cart from "../../models/CartModel.js";
import Order from "../../models/OrderModel.js";
import Payment from "../../models/PaymentModel.js";
import Product from "../../models/ProductModel.js";
import mongoose from "mongoose";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

// translator for ids
const translator = short.createTranslator();

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

    // ---------------------------
    // 1️⃣ Validate input
    // ---------------------------
    if (!userId || !address?.street || !address?.city || !address?.country) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    session.startTransaction();

    // ---------------------------
    // 2️⃣ Load selected products
    // If frontend passes `productIds` we'll use those; otherwise fall back to user's cart
    // ---------------------------
    const requestedProductIds = Array.isArray(req.body.productIds)
      ? req.body.productIds.map((id) => new mongoose.Types.ObjectId(id))
      : null;

    let products = [];
    let productIds = [];

    if (requestedProductIds && requestedProductIds.length) {
      // load products by ids
      products = await Product.find({
        _id: { $in: requestedProductIds },
        status: "active",
        stock: { $gt: 0 },
      }).session(session);

      if (!products.length || products.length !== requestedProductIds.length) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "Some selected products are unavailable" });
      }

      productIds = products.map((p) => p._id);
    } else {
      // load from user's cart
      const cartItems = await Cart.aggregate([
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
      ]).session(session);

      if (!cartItems.length) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Cart is empty" });
      }

      products = cartItems.map((c) => c.productDetails);
      productIds = products.map((p) => p._id);
    }

    const totalAmount = products.reduce((sum, p) => sum + (p.price || 0), 0);

    // ---------------------------
    // 3️⃣ Lock stock (atomic)
    // ---------------------------
    const stockUpdate = await Product.updateMany(
      { _id: { $in: productIds }, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { session }
    );

    if (stockUpdate.modifiedCount !== productIds.length) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Some items went out of stock" });
    }

    // ---------------------------
    // 4️⃣ Create Order
    // ---------------------------
    const orderReadableId = translator.new();

    const [order] = await Order.create(
      [
        {
          orderId: orderReadableId,
          customer: userId,
          products: productIds,
          item: products.length,
          amount: totalAmount,
          address,
          paymentMethod,
          paymentStatus: "pending",
          status: "pending",
        },
      ],
      { session }
    );

    // ---------------------------
    // 5️⃣ Seller breakdown
    // ---------------------------
    const commissionPercent = Number(
      process.env.PLATFORM_COMMISSION_PERCENT || 20
    );

    const sellerMap = {};

    for (const p of products) {
      const sellerId = p.seller?.toString();
      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = { amount: 0, items: [] };
      }
      sellerMap[sellerId].amount += p.price || 0;
      sellerMap[sellerId].items.push({
        productId: p._id.toString(),
        price: p.price,
      });
    }

    const sellerBreakdown = Object.entries(sellerMap).map(
      ([sellerId, data]) => {
        const commission = +(data.amount * (commissionPercent / 100)).toFixed(
          2
        );
        const net = +(data.amount - commission).toFixed(2);
        return {
          sellerId,
          gross: data.amount,
          commission,
          net,
          items: data.items,
        };
      }
    );

    // ---------------------------
    // 6️⃣ CARD PAYMENT (Stripe)
    // ---------------------------
    if (paymentMethod === "card") {
      const line_items = products.map((p) => ({
        price_data: {
          currency: process.env.DEFAULT_CURRENCY || "usd",
          product_data: {
            name: p.name,
          },
          unit_amount: Math.round((p.price || 0) * 100),
        },
        quantity: 1,
      }));

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${orderReadableId}`,
        metadata: {
          orderId: order._id.toString(),
          orderReadableId,
          userId,
          sellerBreakdown: JSON.stringify(sellerBreakdown),
        },
      });

      const [payment] = await Payment.create(
        [
          {
            paymentId: translator.new(),
            order: order._id,
            buyer: userId,
            amount: totalAmount,
            currency: process.env.DEFAULT_CURRENCY || "USD",
            status: "pending",
            method: "stripe_checkout",
            stripeSessionId: checkoutSession.id,
            metadata: { sellerBreakdown },
          },
        ],
        { session }
      );

      // remove only the selected items from cart if productIds were provided
      if (productIds && productIds.length && requestedProductIds) {
        await Cart.deleteMany(
          {
            user: new mongoose.Types.ObjectId(userId),
            product: { $in: productIds },
          },
          { session }
        );
      } else {
        await Cart.deleteMany(
          { user: new mongoose.Types.ObjectId(userId) },
          { session }
        );
      }

      await session.commitTransaction();

      return res.status(200).json({
        checkoutUrl: checkoutSession.url,
        sessionId: checkoutSession.id,
        orderId: orderReadableId,
        paymentId: payment.paymentId,
      });
    }

    // ---------------------------
    // 7️⃣ COD FLOW
    // ---------------------------
    // For COD flow, remove selected items if provided, otherwise clear cart
    if (productIds && productIds.length && requestedProductIds) {
      await Cart.deleteMany(
        {
          user: new mongoose.Types.ObjectId(userId),
          product: { $in: productIds },
        },
        { session }
      );
    } else {
      await Cart.deleteMany(
        { user: new mongoose.Types.ObjectId(userId) },
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(201).json({
      message: "Order placed with Cash on Delivery",
      orderId: orderReadableId,
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
