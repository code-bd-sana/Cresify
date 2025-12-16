import OrderVendorModel from "../../models/OrderVendorModel.js";
import Payment from "../../models/PaymentModel.js";
import Refund from "../../models/RefundModel.js";

/**
 * Customer submits a refund request for an order/payment
 */
export const requestRefund = async (req, res) => {
  try {
    const { paymentId, orderId, userId, sellerIds, reason, evidence } = req.body;

    if (!paymentId || !orderId || !userId || ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if(sellerIds && !Array.isArray(sellerIds)) {
      return res.status(400).json({ message: "sellerIds must be an array" });
    }



    /**
     * Validate evidence format
     */
    if (evidence !== undefined) {
      if (!Array.isArray(evidence)) {
        return res.status(400).json({
          message: "Evidence must be an array",
        });
      }

      for (const [index, item] of evidence.entries()) {
        if (typeof item !== "object" || item === null) {
          return res.status(400).json({
            message: `Evidence item at index ${index} must be an object`,
          });
        }

        if (item.type !== undefined && typeof item.type !== "string") {
          return res.status(400).json({
            message: `Evidence.type at index ${index} must be a string`,
          });
        }

        if (item.url !== undefined && typeof item.url !== "string") {
          return res.status(400).json({
            message: `Evidence.url at index ${index} must be a string`,
          });
        }

        if (item.note !== undefined && typeof item.note !== "string") {
          return res.status(400).json({
            message: `Evidence.note at index ${index} must be a string`,
          });
        }

        if (!item.type && !item.url && !item.note) {
          return res.status(400).json({
            message: `Evidence item at index ${index} must contain at least one field (type, url, or note)`,
          });
        }
      }
    }

    const payment = await Payment.findOne({ paymentId });


    const orderVendors = await OrderVendorModel.find({
      order: orderId,
      seller: { $in: sellerIds || []},
    });

    if (!payment || !orderVendors.length)
      return res.status(404).json({ message: "Payment or order vendors not found" });

    const existingRefund = await Refund.findOne({
      payment: payment._id,
      order: order._id,
      requestedBy: userId,
      status: {
        $in: [
          "requested",
          "under_review",
          "approved",
          "partial_refunded",
          "rejected",
          "refunded_full",
          "refunded_partial",
        ],
      },
    });

    if (existingRefund) {
      return res.status(400).json({
        message: `A refund request already exists for this order. Current status: ${existingRefund.status}.`,
      });
    }

    

    const refund = await Refund.create({
      payment: payment._id,
      order: order._id,
      requestedBy: userId,
      amount: payment.amount,
      currency: payment.currency || "usd",
      reason,
      evidence,
      status: "requested",
    });

    return res.status(201).json({ message: "Refund requested", refund });
  } catch (err) {
    console.error("requestRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to request refund", error: err.message });
  }
};

export default { requestRefund };
