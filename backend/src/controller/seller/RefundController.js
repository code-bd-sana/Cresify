import mongoose from "mongoose";
import Refund from "../../models/RefundModel.js";
import {
  extractBase64FromDataURL,
  uploadImageToImgBB,
} from "../../utils/imageUpload.js";

/**
 * List refunds for a seller
 * Query params: sellerId, page, limit
 */
export const listSellerRefunds = async (req, res) => {
  try {
    const { sellerId, page = 1, limit = 20 } = req.query;
    if (!sellerId)
      return res.status(400).json({ message: "sellerId required" });

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const pipeline = [
      { $match: { seller: sellerObjectId } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $lookup: {
                from: "orders",
                localField: "order",
                foreignField: "_id",
                as: "order",
              },
            },
            { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                amount: 1,
                currency: 1,
                status: 1,
                createdAt: 1,
                order: {
                  _id: "$order._id",
                  paymentStatus: "$order.paymentStatus",
                  createdAt: "$order.createdAt",
                },
                items: 1,
              },
            },
          ],
        },
      },
    ];

    const result = await Refund.aggregate(pipeline);
    const refunds = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    return res.json({
      refunds,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("listSellerRefunds error", err);
    return res
      .status(500)
      .json({ message: "Failed to list refunds", error: err.message });
  }
};

/**
 * Get refund detail for a seller
 */
export const getSellerRefund = async (req, res) => {
  try {
    const id = req.params.id;
    const sellerId = req.body.sellerId;
    if (!id || !sellerId)
      return res.status(400).json({ message: "id and sellerId required" });

    const refund = await Refund.findById(id)
      .populate({
        path: "orderVendor",
        populate: { path: "seller", select: "name shopName shopLogo" },
      })
      .populate("requestedBy")
      .populate({ path: "items.product", select: "name price image" });

    if (!refund) return res.status(404).json({ message: "Refund not found" });
    if (refund.seller?.toString() !== sellerId.toString())
      return res.status(403).json({ message: "Not authorized" });

    return res.json({ refund });
  } catch (err) {
    console.error("getSellerRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch refund", error: err.message });
  }
};

/**
 * Seller responds to a refund: provide proof, accept, or dispute.
 * body: { id, sellerId, action: 'provide_proof'|'accept'|'reject', note, evidence[] }
 */
export const respondToRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId, action, note, evidence } = req.body;
    if (!id || !sellerId || !action)
      return res.status(400).json({ message: "Missing fields" });

    const refund = await Refund.findById(id);
    if (!refund) return res.status(404).json({ message: "Refund not found" });
    if (refund.seller?.toString() !== sellerId.toString())
      return res.status(403).json({ message: "Not authorized" });

    // handle evidence uploads
    let uploaded = [];
    if (Array.isArray(evidence) && evidence.length) {
      for (const e of evidence) {
        try {
          const base64 = extractBase64FromDataURL(e.url || e);
          const up = await uploadImageToImgBB(base64);
          uploaded.push({ type: e.type || "image", url: up.url, note: e.note });
        } catch (err) {
          uploaded.push({
            type: e.type || "image",
            url: e.url || null,
            note: e.note,
          });
        }
      }
    }

    if (action === "provide_proof") {
      refund.evidence = [...(refund.evidence || []), ...uploaded];
      refund.status = "under_review";
      refund.adminNotes = note || refund.adminNotes;
      await refund.save();
      return res.json({ message: "Proof uploaded", refund });
    }

    if (action === "accept") {
      refund.status = "approved";
      refund.adminNotes = note || refund.adminNotes;
      refund.processedBy = refund.seller; // mark seller as responder (note: final processing still admin)
      refund.processedAt = new Date();
      await refund.save();
      return res.json({
        message: "Seller accepted refund (awaiting admin)",
        refund,
      });
    }

    if (action === "reject") {
      refund.status = "rejected";
      refund.adminNotes = note || refund.adminNotes;
      refund.processedBy = refund.seller;
      refund.processedAt = new Date();
      await refund.save();
      return res.json({ message: "Seller rejected refund", refund });
    }

    // unsupported action
    return res.status(400).json({ message: "Unsupported action" });
  } catch (err) {
    console.error("respondToRefund error", err);
    return res
      .status(500)
      .json({ message: "Failed to respond to refund", error: err.message });
  }
};
