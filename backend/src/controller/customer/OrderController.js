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
    const { userId, address, paymentMethod, items } = req.body;

    if (!userId || !address?.street || !address?.city || !address?.country) {
      return res.status(400).json({ message: "Invalid address or user" });
    }

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    session.startTransaction();

    /* --------------------------------------------------
       STEP 1: UPSERT CART (BUY NOW + CART CHECKOUT)
    -------------------------------------------------- */

    for (const item of items) {
      if (!item.productId || item.quantity < 1) {
        throw new Error("Invalid product or quantity");
      }

      await Cart.findOneAndUpdate(
        { user: userId, product: item.productId },
        { $set: { count: Number(item.quantity) } },
        { upsert: true, new: true, session }
      );
    }

    /* --------------------------------------------------
       STEP 2: LOAD PRODUCTS STRICTLY FROM CART
    -------------------------------------------------- */

    const products = await Cart.aggregate([
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

      {
        $match: {
          $expr: { $gte: ["$product.stock", "$count"] },
        },
      },

      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          seller: "$product.seller",
          price: "$product.price",
          quantity: { $toInt: "$count" }, // 🔥 ONLY SOURCE
        },
      },
    ]);

    if (!products.length) {
      throw new Error("Cart is empty or insufficient stock");
    }

    /* --------------------------------------------------
       STEP 3: STOCK LOCK
    -------------------------------------------------- */

    const bulkOps = products.map((p) => ({
      updateOne: {
        filter: { _id: p._id, stock: { $gte: p.quantity } },
        update: { $inc: { stock: -p.quantity } },
      },
    }));

    const stockResult = await Product.bulkWrite(bulkOps, { session });

    if (stockResult.modifiedCount !== products.length) {
      throw new Error("Insufficient stock");
    }

    /* --------------------------------------------------
       STEP 4: SELLER BREAKDOWN
    -------------------------------------------------- */

    const commissionPercent = Number(
      process.env.PLATFORM_COMMISSION_PERCENT || 20
    );

    const sellerMap = {};

    for (const p of products) {
      const sellerId = p.seller.toString();
      const amount = p.price * p.quantity;

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          seller: p.seller,
          products: [],
          gross: 0,
        };
      }

      sellerMap[sellerId].products.push({
        product: p._id,
        quantity: p.quantity,
        price: p.price,
        amount,
      });

      sellerMap[sellerId].gross += amount;
    }

    const totalAmount = Object.values(sellerMap).reduce(
      (sum, s) => sum + s.gross,
      0
    );

    /* --------------------------------------------------
       STEP 5: CREATE ORDER
    -------------------------------------------------- */

    const [order] = await Order.create(
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

    /* --------------------------------------------------
       STEP 6: CREATE ORDER VENDORS
    -------------------------------------------------- */

    const vendorDocs = Object.values(sellerMap).map((s) => {
      const commission = (s.gross * commissionPercent) / 100;

      return {
        order: order._id,
        seller: s.seller,
        products: s.products,
        amount: s.gross,
        commission,
        netAmount: s.gross - commission,
      };
    });

    const vendors = await OrderVendor.insertMany(vendorDocs, { session });

    order.orderVendors = vendors.map((v) => v._id);
    await order.save({ session });

    /* --------------------------------------------------
       STEP 7: STRIPE PAYMENT
    -------------------------------------------------- */

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
          quantity: p.quantity,
        })),
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        metadata: {
          orderId: order._id.toString(),
          userId,
        },
      });

      await Payment.create(
        [
          {
            order: order._id,
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

    /* --------------------------------------------------
       STEP 8: COD
    -------------------------------------------------- */

    await Cart.deleteMany({ user: userId }, { session });
    await session.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully (COD)",
      orderId: order._id,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};



export const MyOrder = async(req, res)=>{
  try {
    const id = req.params.id;
const result = await Order.find({ customer: id })
  .populate({
    path: "orderVendors",
    populate: {
      path: "products.product",
      model: "Product", // model name exactly যেটা define করা
    },
  });

    res.status(200).json({
      message:"Success",
      data:result

    })
    
  } catch (error) {
    res.status(500).json({
      error,
      message:error?.message

    })
    
  }
}