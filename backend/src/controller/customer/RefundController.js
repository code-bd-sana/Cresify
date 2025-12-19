import Order from "../../models/OrderModel.js";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import Payment from "../../models/PaymentModel.js";
import Product from "../../models/ProductModel.js";
import Refund from "../../models/RefundModel.js";
import {
  extractBase64FromDataURL,
  uploadImageToImgBB,
} from "../../utils/imageUpload.js";

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

    /**
     * Validate evidence format
     */
    if (evidence !== undefined && !Array.isArray(evidence)) {
      return res.status(400).json({ message: "Evidence must be an array" });
    }

    // Load payment and order
    const payment = await Payment.findOne({ paymentId });
    const order = await Order.findById(orderId);

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
          const itemAmount = price * qty;
          let itemShipping = 0;
          if (prod?.shippingType === "fixed")
            itemShipping = (prod.shippingCost || 0) * qty;

          refundAmount += itemAmount + itemShipping;
          refundItems.push({
            product: it.productId,
            quantity: qty,
            price,
            amount: itemAmount,
            shippingAmount: itemShipping,
          });
        }

        // handle evidence upload if provided (evidence may be base64 data URLs)
        let uploadedEvidence = [];
        const ev = its[0].evidence || evidence || [];
        if (Array.isArray(ev) && ev.length) {
          for (const e of ev) {
            try {
              const base64 = extractBase64FromDataURL(e.url || e);
              const uploaded = await uploadImageToImgBB(base64);
              uploadedEvidence.push({
                type: e.type || "image",
                url: uploaded.url,
                note: e.note,
              });
            } catch (err) {
              // ignore image upload failure for now, keep original url if present
              uploadedEvidence.push({
                type: e.type || "image",
                url: e.url || null,
                note: e.note,
              });
            }
          }
        }

        const refundDoc = await Refund.create({
          payment: payment._id,
          order: order._id,
          orderVendor: ov._id,
          requestedBy: userId,
          amount: refundAmount,
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
      // Full vendor refunds requested
      const orderVendors = await OrderVendorModel.find({
        order: orderId,
        seller: { $in: sellerIds },
      });
      for (const ov of orderVendors) {
        const refundAmount = ov.amount + (ov.shippingAmount || 0);

        // upload evidence if any
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
              });
            } catch (err) {
              uploadedEvidence.push({
                type: e.type || "image",
                url: e.url || null,
                note: e.note,
              });
            }
          }
        }

        const refundDoc = await Refund.create({
          payment: payment._id,
          order: order._id,
          orderVendor: ov._id,
          requestedBy: userId,
          amount: refundAmount,
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
      const refundDoc = await Refund.create({
        payment: payment._id,
        order: order._id,
        requestedBy: userId,
        amount: payment.amount,
        currency: payment.currency || "usd",
        reason,
        evidence: evidence || [],
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

export default { requestRefund };
