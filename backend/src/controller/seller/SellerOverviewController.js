import mongoose from "mongoose";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import Product from "../../models/ProductModel.js";

export const sellerOverview = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.params.id);

    // 1️⃣ Total seller payout (overall)
    const payoutResult = await OrderVendorModel.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          totalSellerPayout: { $sum: "$sellerPayout" }
        }
      }
    ]);
    const totalSales = payoutResult[0]?.totalSellerPayout || 0;

    // 2️⃣ Total orders
    const totalOrders = await OrderVendorModel.countDocuments({
      seller: sellerId
    });

    // 3️⃣ Total products
    const totalProduct = await Product.countDocuments({
      seller: sellerId
    });

    // 4️⃣ Average rating
    const ratingResult = await Product.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = ratingResult[0]?.avgRating || 0;

    // 5️⃣ Monthly chart data
    const monthlyData = await OrderVendorModel.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: { $month: "$createdAt" }, // 1 = Jan, 2 = Feb ...
          monthlySales: { $sum: "$sellerPayout" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // convert to chart format
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const chartData = monthNames.map((m, idx) => {
      const monthEntry = monthlyData.find(d => d._id === idx + 1);
      return {
        month: m,
        value: monthEntry ? Number(monthEntry.monthlySales.toFixed(2)) : 0
      };
    });

    // ✅ Response
    res.status(200).json({
      success: true,
      data: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalProduct,
        avgRating: Number(avgRating.toFixed(1)),
        chartData // ready to pass to Recharts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error
    });
  }
};
