import User from "../../models/UserModel.js";

/**
 * @function adminOverview
 * @description Provides admin overview metrics:
 *              - Total Users
 *              - Total Sellers
 *              - Total Buyers
 *              - Total Service Providers
 * @route GET /admin/users/overview
 * @access Admin
 */
export const adminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalProviders = await User.countDocuments({ role: "provider" });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalBuyers,
        totalServiceProviders: totalProviders,
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

/**
 * @function getAllUsers
 * @description Retrieves all users from the database.
 * @route GET /admin/users/all
 * @access Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

/**
 * @function searchUsers
 * @description Searches users by name or email.
 * @query email, name
 * @route GET /admin/users/search
 * @access Admin
 */
export const searchUsers = async (req, res) => {
  try {
    const { email, name } = req.query;

    const query = {};

    if (email) {
      query.email = { $regex: email, $options: "i" };
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

/**
 * @function changeUserStatus
 * @description Updates the status of a user (active, pending, suspend).
 * @params id
 * @body status
 * @route PUT /admin/users/status/:id
 * @access Admin
 */
export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "pending", "suspend"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};
