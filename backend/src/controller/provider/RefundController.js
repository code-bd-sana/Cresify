import mongoose from "mongoose";
import Refund from "../../models/RefundModel.js";

/**
 * List refunds for a provider (service provider)
 * Query params: providerId, page, limit
 */
export const listProviderRefunds = async (req, res) => {
  try {
    const { providerId, page = 1, limit = 20 } = req.query;
    if (!providerId)
      return res.status(400).json({ message: "providerId required" });

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const providerObjectId = new mongoose.Types.ObjectId(providerId);

    // Match refunds where either the refund.seller equals providerId
    // or the linked orderVendor.seller equals providerId
    const pipeline = [
      {
        $lookup: {
          from: "ordervendors",
          localField: "orderVendor",
          foreignField: "_id",
          as: "orderVendor",
        },
      },
      { $unwind: { path: "$orderVendor", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          provider: providerObjectId,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $lookup: {
                from: "users",
                localField: "requestedBy",
                foreignField: "_id",
                as: "requestedBy",
              },
            },
            {
              $unwind: {
                path: "$requestedBy",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                amount: 1,
                currency: 1,
                status: 1,
                createdAt: 1,
                reason: 1,
                requestedBy: {
                  _id: "$requestedBy._id",
                  name: "$requestedBy.firstName",
                  email: "$requestedBy.email",
                },
                items: 1,
                evidence: 1,
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
    console.error("listProviderRefunds error", err);
    return res
      .status(500)
      .json({ message: "Failed to list refunds", error: err.message });
  }
};

export default { listProviderRefunds };
