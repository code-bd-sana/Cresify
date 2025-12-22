import mongoose from "mongoose";
import Order from "../../models/OrderModel.js";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import Payment from "../../models/PaymentModel.js";
import Product from "../../models/ProductModel.js";
import Refund from "../../models/RefundModel.js";
import {
  extractBase64FromDataURL,
  uploadImageToImgBB,
} from "../../utils/imageUpload.js";

const toTwo = (v) => Number(Number(v || 0).toFixed(2));

/**
 * Customer submits a refund request for an order/payment
 */
export const requestRefund = async (req, res) => {
  try {
    const { paymentId, orderId, userId, sellerIds, reason, evidence, items } =
      req.body;

    if (!paymentId || !orderId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (sellerIds && !Array.isArray(sellerIds)) {
      return res.status(400).json({ message: "sellerIds must be an array" });
    }

    // If sellerIds provided and non-empty, require evidence to be a non-empty array
    if (Array.isArray(sellerIds) && sellerIds.length) {
      if (!Array.isArray(evidence) || evidence.length === 0) {
        return res.status(400).json({
          message:
            "Evidence is required and must be a non-empty array when requesting per-seller refunds",
        });
      }
    }

    // If items provided, require each item to include a non-empty evidence array
    if (Array.isArray(items) && items.length) {
      for (const it of items) {
        if (!Array.isArray(it.evidence) || it.evidence.length === 0) {
          return res.status(400).json({
            message: "Each item must include a non-empty evidence array",
          });
        }
      }
    }

    // Load payment and order
    const payment = await Payment.findById(
      new mongoose.Types.ObjectId(paymentId)
    );
    const order = await Order.findById(new mongoose.Types.ObjectId(orderId));

    if (!payment || !order) {
      return res.status(404).json({ message: "Payment or order not found" });
    }

    // If items provided, group by orderVendor and create per-vendor refund records
    let createdRefunds = [];

    if (Array.isArray(items) && items.length) {
      // items: [{ orderVendorId, productId, quantity, reason, evidence }] - compute amounts per vendor
      const byVendor = items.reduce((m, it) => {
        const vid = it.orderVendorId;
        if (!m[vid]) m[vid] = [];
        m[vid].push(it);
        return m;
      }, {});

      for (const [orderVendorId, its] of Object.entries(byVendor)) {
        const ov = await OrderVendorModel.findById(orderVendorId).lean();
        if (!ov) continue;

        // compute refund amount for these items
        let refundAmount = 0;
        const refundItems = [];

        for (const it of its) {
          const prod = await Product.findById(it.productId).lean();
          const qty = Number(it.quantity || 1);
          const price = prod?.price || 0;
          const itemAmount = toTwo(price * qty);
          let itemShipping = 0;
          if (prod?.shippingType === "fixed")
            itemShipping = toTwo((prod.shippingCost || 0) * qty);

          refundAmount = toTwo(refundAmount + itemAmount + itemShipping);
          refundItems.push({
            product: it.productId,
            quantity: qty,
            price: toTwo(price),
            amount: itemAmount,
            shippingAmount: itemShipping,
          });
        }

        // handle evidence upload: collect evidence from all items for this vendor
        let uploadedEvidence = [];
        // Each item is required to have an `evidence` array per validation above.
        // Aggregate all item evidence entries for this vendor.
        let ev = its.flatMap((i) =>
          Array.isArray(i.evidence) ? i.evidence : []
        );
        // As a safety fallback, include global `evidence` if present and ev is empty
        if (
          (!Array.isArray(ev) || ev.length === 0) &&
          Array.isArray(evidence)
        ) {
          ev = ev.concat(evidence);
        }

        if (Array.isArray(ev) && ev.length) {
          for (const e of ev) {
            try {
              const base64 = extractBase64FromDataURL(e.url || e);
              const uploaded = await uploadImageToImgBB(base64);
              uploadedEvidence.push({
                type: e.type || "image",
                url: uploaded.url,
                note: e.note,
                uploadedBy: new mongoose.Types.ObjectId(userId),
              });
            } catch (err) {
              // ignore image upload failure for now, keep original url if present
              uploadedEvidence.push({
                type: e.type || "image",
                url: e.url || null,
                note: e.note,
                uploadedBy: new mongoose.Types.ObjectId(userId),
              });
            }
          }
        }

        const refundDoc = await Refund.create({
          payment: payment._id,
          order: order._id,
          orderVendor: ov._id,
          requestedBy: new mongoose.Types.ObjectId(userId),
          amount: toTwo(refundAmount),
          currency: payment.currency || "usd",
          reason: its[0].reason || reason,
          evidence: uploadedEvidence,
          items: refundItems,
          seller: ov.seller,
          status: "requested",
        });

        createdRefunds.push(refundDoc);
      }
    } else if (Array.isArray(sellerIds) && sellerIds.length) {
      // Full vendor refunds requested for specific sellers
      // const sellerObjectIds = sellerIds.map(
      //   (s) => new mongoose.Types.ObjectId(s)
      // );
      const orderVendors = await OrderVendorModel.find({
        order: new mongoose.Types.ObjectId(orderId),
        // seller: { $in: sellerObjectIds },
      });

      for (const ov of orderVendors) {
        const refundAmount = toTwo(ov.amount + (ov.shippingAmount || 0));

        // upload evidence (evidence is required when sellerIds provided per validation above)
        let uploadedEvidence = [];
        if (Array.isArray(evidence) && evidence.length) {
          for (const e of evidence) {
            try {
              const base64 = extractBase64FromDataURL(e.url || e);
              const uploaded = await uploadImageToImgBB(base64);
              uploadedEvidence.push({
                type: e.type || "image",
                url: uploaded.url,
                note: e.note,
                uploadedBy: new mongoose.Types.ObjectId(userId),
              });
            } catch (err) {
              uploadedEvidence.push({
                type: e.type || "image",
                url: e.url || null,
                note: e.note,
                uploadedBy: new mongoose.Types.ObjectId(userId),
              });
            }
          }
        }

        const refundDoc = await Refund.create({
          payment: new mongoose.Types.ObjectId(payment._id),
          order: new mongoose.Types.ObjectId(order._id),
          orderVendor: new mongoose.Types.ObjectId(ov._id),
          requestedBy: new mongoose.Types.ObjectId(userId),
          amount: toTwo(refundAmount),
          currency: payment.currency || "usd",
          reason,
          evidence: uploadedEvidence,
          seller: ov.seller,
          status: "requested",
        });
        createdRefunds.push(refundDoc);
      }
    } else {
      // Generic full order refund request
      // normalize evidence to ensure uploadedBy is present
      let finalEvidence = [];
      if (Array.isArray(evidence) && evidence.length) {
        for (const e of evidence) {
          if (typeof e === "string") {
            finalEvidence.push({
              type: "image",
              url: e,
              uploadedBy: new mongoose.Types.ObjectId(userId),
            });
          } else {
            finalEvidence.push({ ...e, uploadedBy: e.uploadedBy || userId });
          }
        }
      }

      const refundDoc = await Refund.create({
        payment: payment._id,
        order: order._id,
        requestedBy: new mongoose.Types.ObjectId(userId),
        amount: toTwo(payment.amount),
        currency: payment.currency || "usd",
        reason,
        evidence: finalEvidence,
        status: "requested",
      });
      createdRefunds.push(refundDoc);
    }

    return res
      .status(201)
      .json({ message: "Refund requested", refunds: createdRefunds });
  } catch (err) {
    console.error("requestRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to request refund", error: err.message });
  }
};

/*
 * List refunds requested by the logged-in customer
 */
export const listMyRefunds = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const refunds = await Refund.find({
      requestedBy: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .populate("order")
      .populate({
        path: "orderVendor",
        populate: { path: "seller", select: "name shopName shopLogo" },
      })
      .populate({
        path: "evidence",
        populate: { path: "evidence.uploadedBy", select: "firstName lastName" },
      })
      .populate({ path: "items.product", select: "name price image" });

    return res.json({ refunds });
  } catch (err) {
    console.error("listMyRefunds error", err);
    return res
      .status(500)
      .json({ message: "Failed to list refunds", error: err.message });
  }
};

/**
 * Get refund detail for a customer
 */
export const getRefund = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const refund = await Refund.findById(id)
      .populate("order")
      .populate({
        path: "orderVendor",
        populate: { path: "seller", select: "name shopName shopLogo" },
      })
      .populate({ path: "items.product", select: "name price image" });

    if (!refund) return res.status(404).json({ message: "Refund not found" });

    if (refund.requestedBy?.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this refund" });
    }

    return res.json({ refund });
  } catch (err) {
    console.error("getRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to get refund", error: err.message });
  }
};
