import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";

import Cart from "../../models/CartModel.js";
import Order from "../../models/OrderModel.js";
import OrderVendor from "../../models/OrderVendorModel.js";
import Payment from "../../models/PaymentModel.js";
import Product from "../../models/ProductModel.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

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
    const { userId, address, paymentMethod, productIds } = req.body;

    if (!userId || !address?.street || !address?.city || !address?.country) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    session.startTransaction();

    /* -------------------- Load Products -------------------- */

    let products = [];

    if (Array.isArray(productIds) && productIds.length) {
      products = await Product.find({
        _id: { $in: productIds },
        status: "active",
        stock: { $gt: 0 },
      }).session(session);

      if (products.length !== productIds.length) {
        throw new Error("Some products are unavailable");
      }

      products = products.map((p) => ({ ...p.toObject(), count: 1 }));
    } else {
      const cartItems = await Cart.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        { $match: { "product.stock": { $gt: 0 } } },
      ]);

      if (!cartItems.length) {
        throw new Error("Cart is empty");
      }

      products = cartItems.map((c) => ({
        ...c.product,
        count: c.count,
      }));
    }

    /* -------------------- Stock Lock -------------------- */

    const bulkOps = products.map((p) => ({
      updateOne: {
        filter: { _id: p._id, stock: { $gte: p.count } },
        update: { $inc: { stock: -p.count } },
      },
    }));

    const stockResult = await Product.bulkWrite(bulkOps, { session });

    if (stockResult.modifiedCount !== products.length) {
      throw new Error("Insufficient stock");
    }

    /* -------------------- Seller Breakdown -------------------- */

    const commissionPercent = Number(
      process.env.PLATFORM_COMMISSION_PERCENT || 20
    );

    const sellerMap = {};

    for (const p of products) {
      const sellerId = p.seller.toString();

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          seller: p.seller,
          products: [],
          gross: 0,
        };
      }

      sellerMap[sellerId].products.push({
        product: p._id,
        quantity: p.count,
        price: p.price,
      });

      sellerMap[sellerId].gross += p.price * p.count;
    }

    const totalAmount = Object.values(sellerMap).reduce(
      (sum, s) => sum + s.gross,
      0
    );

    /* -------------------- Create Order -------------------- */

    const order = await Order.create(
      [
        {
          customer: userId,
          amount: totalAmount,
          address,
          paymentMethod,
        },
      ],
      { session }
    );

    /* -------------------- Create OrderVendor -------------------- */

    const orderVendorDocs = [];

    for (const s of Object.values(sellerMap)) {
      const commission = +(s.gross * commissionPercent) / 100;
      const net = s.gross - commission;

      orderVendorDocs.push({
        order: order[0]._id,
        seller: s.seller,
        products: s.products,
        amount: s.gross,
        commission,
        netAmount: net,
      });
    }

    const vendors = await OrderVendor.insertMany(orderVendorDocs, { session });

    order[0].orderVendors = vendors.map((v) => v._id);
    await order[0].save({ session });

    /* -------------------- STRIPE -------------------- */

    if (paymentMethod === "card") {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: products.map((p) => ({
          price_data: {
            currency: "usd",
            product_data: { name: p.name },
            unit_amount: Math.round(p.price * 100),
          },
          quantity: p.count,
        })),
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        metadata: {
          orderId: order[0]._id.toString(),
          userId,
          itemType: "product",
        },
      });

      await Payment.create(
        [
          {
            order: order[0]._id,
            buyer: userId,
            amount: totalAmount,
            status: "pending",
            method: "stripe_checkout",
            stripeSessionId: checkoutSession.id,
          },
        ],
        { session }
      );

      await Cart.deleteMany({ user: userId }, { session });
      await session.commitTransaction();

      return res.json({ checkoutUrl: checkoutSession.url });
    }

    /* -------------------- COD -------------------- */

    await Cart.deleteMany({ user: userId }, { session });
    await session.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully (COD)",
      orderId: order[0]._id,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};
