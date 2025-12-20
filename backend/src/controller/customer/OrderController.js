import dotenv from "dotenv";
import mongoose from "mongoose";
import Stripe from "stripe";

import Booking from "../../models/BookingModel.js";
import Cart from "../../models/CartModel.js";
import {
  default as Order,
  default as OrderModel,
} from "../../models/OrderModel.js";
import OrderVendor from "../../models/OrderVendorModel.js";
import Payment from "../../models/PaymentModel.js";
import Product from "../../models/ProductModel.js";
import User from "../../models/UserModel.js";
import WishList from "../../models/WishListModel.js";
import { toTwo } from "../../utils/money.js";

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
       STEP 1: UPSERT CART (BUY NOW + CART CHECKOUT) - batched
    -------------------------------------------------- */

    const cartBulkOps = [];
    for (const item of items) {
      if (!item.productId || item.quantity < 1) {
        throw new Error("Invalid product or quantity");
      }

      cartBulkOps.push({
        updateOne: {
          filter: {
            user: new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(item.productId),
          },
          update: { $set: { count: Number(item.quantity) } },
          upsert: true,
        },
      });
    }

    if (cartBulkOps.length) {
      await Cart.bulkWrite(cartBulkOps, { session });
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
          quantity: { $toInt: "$count" }, // ONLY SOURCE
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
      process.env.PLATFORM_COMMISSION_PERCENT || 10
    );
    const commissionVATRate = Number(
      process.env.PLATFORM_COMMISSION_VAT_PERCENT || 19
    );

    // Group products per seller and compute gross and shipping per seller
    const sellerMap = {};
    let totalProductAmount = 0;
    let totalShippingAmount = 0;

    for (const p of products) {
      const sellerId = p.seller.toString();
      const productAmount = toTwo(p.price * p.quantity);

      // Determine product-level shipping
      let productShipping = 0;
      // We didn't include shippingType/cost in the aggregation projection earlier; attempt to load product details
      const prodDoc = await Product.findById(p._id)
        .select("shippingType shippingCost")
        .session(session)
        .lean();
      if (prodDoc?.shippingType === "fixed") {
        productShipping = toTwo((prodDoc.shippingCost || 0) * p.quantity);
      }

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          seller: p.seller,
          products: [],
          gross: 0,
          shipping: 0,
        };
      }

      sellerMap[sellerId].products.push({
        product: p._id,
        quantity: p.quantity,
        price: toTwo(p.price),
        amount: productAmount,
        shipping: productShipping,
      });

      sellerMap[sellerId].gross = toTwo(
        sellerMap[sellerId].gross + productAmount
      );
      sellerMap[sellerId].shipping = toTwo(
        sellerMap[sellerId].shipping + productShipping
      );
      totalProductAmount = toTwo(totalProductAmount + productAmount);
      totalShippingAmount = toTwo(totalShippingAmount + productShipping);
    }

    const totalAmount = toTwo(totalProductAmount + totalShippingAmount);

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

    // Build vendor docs and seller breakdown for payment metadata
    const vendorDocs = [];
    const sellerBreakdown = [];
    let totalCommissionAmount = 0;
    let totalCommissionVATAmount = 0;

    // load seller user details for shipping line item names
    const sellerIds = Object.keys(sellerMap).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const sellers = await User.find({ _id: { $in: sellerIds } }).lean();
    const sellerById = new Map(sellers.map((s) => [s._id.toString(), s]));

    for (const [sellerId, s] of Object.entries(sellerMap)) {
      const commissionAmount = toTwo((s.gross * commissionPercent) / 100);
      const commissionVATAmount = toTwo(
        (commissionAmount * commissionVATRate) / 100
      );
      const commissionTotal = toTwo(commissionAmount + commissionVATAmount);
      const sellerPayout = toTwo(s.gross - commissionTotal - s.shipping);

      totalCommissionAmount = toTwo(totalCommissionAmount + commissionAmount);
      totalCommissionVATAmount = toTwo(
        totalCommissionVATAmount + commissionVATAmount
      );

      vendorDocs.push({
        order: order._id,
        orderId: order.orderId,
        seller: s.seller,
        products: s.products,
        amount: toTwo(s.gross),
        shippingAmount: toTwo(s.shipping || 0),
        commissionPercentage: commissionPercent,
        commissionAmount: commissionAmount,
        commissionVATRate,
        commissionVATAmount: commissionVATAmount,
        commissionTotal,
        sellerPayout: sellerPayout,
        netAmount: sellerPayout,
      });

      sellerBreakdown.push({
        sellerId,
        gross: toTwo(s.gross),
        shipping: toTwo(s.shipping || 0),
        commissionPercentage: commissionPercent,
        commissionAmount: commissionAmount,
        commissionVATRate,
        commissionVATAmount: commissionVATAmount,
        commissionTotal: commissionTotal,
        net: sellerPayout,
      });
    }

    const vendors = await OrderVendor.insertMany(vendorDocs, { session });

    order.orderVendors = vendors.map((v) => v._id);
    await order.save({ session });

    /* --------------------------------------------------
       STEP 7: STRIPE PAYMENT
    -------------------------------------------------- */

    if (paymentMethod === "card") {
      // build line items including shipping per seller
      const lineItems = [];
      for (const p of products) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: p.name },
            unit_amount: Math.round(p.price * 100),
          },
          quantity: p.quantity,
        });
      }

      // add shipping lines grouped per seller
      for (const sb of sellerBreakdown) {
        if (sb.shipping && sb.shipping > 0) {
          const shop = sellerById.get(sb.sellerId);
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: `Shipping - ${shop?.shopName || sb.sellerId}`,
              },
              unit_amount: Math.round(sb.shipping * 100),
            },
            quantity: 1,
          });
        }
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        metadata: {
          orderId: order._id.toString(),
          userId,
          itemType: "product",
          sellerBreakdown: JSON.stringify(sellerBreakdown),
        },
      });

      await Payment.create(
        [
          {
            order: order._id,
            buyer: userId,
            amount: toTwo(totalAmount),
            currency: "usd",
            status: "pending",
            method: "stripe_checkout",
            stripeSessionId: checkoutSession.id,
            metadata: { sellerBreakdown },
            commissionAmount: toTwo(totalCommissionAmount),
            commissionVATAmount: toTwo(totalCommissionVATAmount),
            commissionVATRate: commissionVATRate,
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
      message: `Order placed successfully (${(
        paymentMethod || "cod"
      ).toUpperCase()})`,
      orderId: order._id,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const MyOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);

    const agg = await Order.aggregate([
      { $match: { customer: objectId } },

      // lookup payments for each order (only _id needed)
      {
        $lookup: {
          from: "payments",
          let: { orderId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$order", "$$orderId"] } } },
            { $project: { _id: 1 } },
          ],
          as: "payments",
        },
      },

      // lookup orderVendors and populate product docs inside each vendor
      {
        $lookup: {
          from: "ordervendors",
          let: { ovIds: "$orderVendors" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$ovIds"] } } },
            {
              $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "products",
                localField: "products.product",
                foreignField: "_id",
                as: "products.productDoc",
              },
            },
            {
              $set: {
                "products.product": {
                  $arrayElemAt: ["$products.productDoc", 0],
                },
              },
            },
            { $project: { "products.productDoc": 0 } },
            {
              $group: {
                _id: "$_id",
                order: { $first: "$order" },
                orderId: { $first: "$orderId" },
                seller: { $first: "$seller" },
                amount: { $first: "$amount" },
                shippingAmount: { $first: "$shippingAmount" },
                commissionPercentage: { $first: "$commissionPercentage" },
                commissionAmount: { $first: "$commissionAmount" },
                commissionVATRate: { $first: "$commissionVATRate" },
                commissionVATAmount: { $first: "$commissionVATAmount" },
                commissionTotal: { $first: "$commissionTotal" },
                sellerPayout: { $first: "$sellerPayout" },
                netAmount: { $first: "$netAmount" },
                products: { $push: "$products" },
              },
            },
          ],
          as: "orderVendors",
        },
      },

      // expose first paymentId for convenience
      {
        $addFields: {
          paymentId: {
            $arrayElemAt: [
              { $map: { input: "$payments", as: "p", in: "$$p._id" } },
              0,
            ],
          },
        },
      },

      { $project: { payments: 0, paymentIds: 0 } },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ message: "Success", data: agg });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const orderOverview = async (req, res) => {
  try {
    const id = req.params.id;
    const totalOrders = await OrderModel.countDocuments({ customer: id });
    const totalWishList = await WishList.countDocuments({ user: id });
    const totalBooking = await Booking.countDocuments({ customer: id });

    res.status(200).json({
      message: "Success",
      totalOrders,
      totalWishList,
      totalBooking,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};
