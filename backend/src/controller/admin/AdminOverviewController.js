import Order from "../../models/OrderModel.js";
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
    const totalServiceProviders = await User.countDocuments({
      role: "provider",
    });
    const totalProduct = await Product.countDocuments({});
    const totalServices = 0;
    const totalBookedServices = 0;
    const totalOrders = await Order.countDocuments({});
    const totalPlatformRevenue = 0;

    return res.status(200).json({
      success: true,
      data: {
        totalBuyers,
        totalSellers,
        totalServiceProviders,
        totalProduct,
        totalServices,
        totalBookedServices,
        totalOrders,
        totalPlatformRevenue: totalPlatformRevenue.toFixed(2),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while generating overview",
      error: error.message,
    });
  }
};
