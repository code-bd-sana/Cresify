import Order from "../../models/OrderModel.js";
import OrderVendorModel from "../../models/OrderVendorModel.js";
import Product from "../../models/ProductModel.js";
import User from "../../models/UserModel.js";

/**
 * @function adminOverview
 * @description Provides admin overview metrics:
 *              - Total Buyers
 *              - Total Sellers
 *              - Total Service Providers
 *              - Total Products
 *              - Total Services
 *              - Total Booked Services
 *              - Total Orders
 *              - Total Platform Revenue
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object containing the overview metrics
 * @route GET /admin/overview
 * @access Admin
 */
export const adminOverview = async (req, res) => {
  try {
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalServiceProviders = await User.countDocuments({ role: "provider" });
    const totalProduct = await Product.countDocuments({});
    const totalOrders = await OrderVendorModel.countDocuments({});

    // 🔥 Monthly sales chart data (amount based)
    const monthlyAmount = await OrderVendorModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // 1 = Jan
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const chartData = months.map((month, index) => {
      const found = monthlyAmount.find(m => m._id === index + 1);
      return {
        name: month,
        value: found ? Number(found.totalAmount.toFixed(2)) : 0
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalBuyers,
        totalSellers,
        totalServiceProviders,
        totalProduct,
        totalOrders,
        chartData // 👈 exactly your required format
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while generating admin overview",
      error: error.message
    });
  }
};
