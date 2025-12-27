import Refund from "../../models/RefundModel.js";

/**
 * List all provider refunds (admin) with pagination
 * Query params: page, limit
 *
 * Returns paginated refunds where `provider` field is present
 */
export const listProviderRefunds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (page < 1) {
      return res
        .status(400)
        .json({ message: "Page must be a positive integer" });
    }
    if (limit < 1 || limit > 100) {
      return res
        .status(400)
        .json({ message: "Limit must be between 1 and 100" });
    }

    const skip = (page - 1) * limit;

    // Count only provider refunds
    const totalCount = await Refund.countDocuments({
      provider: { $exists: true, $ne: null },
    });

    const refunds = await Refund.find({
      provider: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("requestedBy processedBy provider order payment");

    return res.json({
      refunds,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error("listProviderRefunds error", err);
    return res.status(500).json({ message: "Failed to list refunds" });
  }
};

export default { listProviderRefunds };
