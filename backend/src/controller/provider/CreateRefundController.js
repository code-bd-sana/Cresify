import mongoose from "mongoose";
import Refund from "../../models/RefundModel.js";
import {
  extractBase64FromDataURL,
  uploadImageToImgBB,
} from "../../utils/imageUpload.js";

const toTwo = (v) => Number(Number(v || 0).toFixed(2));

/**
 * Provider: submit a refund request for a booking/service
 * body: { providerId, bookingId, customerId, amount, reason, evidence[] }
 */
export const requestProviderRefund = async (req, res) => {
  try {
    const {
      providerId,
      bookingId,
      customerId,
      amount = 0,
      reason,
      evidence,
      paymentId,
    } = req.body;
    if (!providerId || !bookingId || !customerId) {
      return res
        .status(400)
        .json({ message: "providerId, bookingId and customerId required" });
    }

    // process evidence uploads (optional)
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
            uploadedBy: new mongoose.Types.ObjectId(customerId),
          });
        } catch (err) {
          uploadedEvidence.push({
            type: e.type || "image",
            url: e.url || null,
            note: e.note,
            uploadedBy: new mongoose.Types.ObjectId(customerId),
          });
        }
      }
    }

    const payload = {
      // For service refunds we don't have payment/order models; store booking in `order` for reference when available
      order: bookingId ? new mongoose.Types.ObjectId(bookingId) : undefined,
      requestedBy: new mongoose.Types.ObjectId(customerId),
      amount: toTwo(amount),
      currency: "usd",
      reason,
      evidence: uploadedEvidence,
      provider: new mongoose.Types.ObjectId(providerId),
      status: "requested",
    };

    if (paymentId) {
      try {
        payload.payment = new mongoose.Types.ObjectId(paymentId);
      } catch (e) {
        // fallback to raw id if it's not an ObjectId
        payload.payment = paymentId;
      }
    }

    const refundDoc = await Refund.create(payload);

    return res
      .status(201)
      .json({ message: "Provider refund requested", refund: refundDoc });
  } catch (err) {
    console.error("requestProviderRefund error", err);
    return res.status(500).json({
      message: "Failed to request provider refund",
      error: err.message,
    });
  }
};

export default { requestProviderRefund };
