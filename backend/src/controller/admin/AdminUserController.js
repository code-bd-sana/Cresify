import User from "../../models/UserModel.js";

/**
 * @function getAllUsers
 * @description Retrieves all users from the database with search and pagination.
 * @query search - Search by email or name (optional)
 * @query skip - Number of records to skip for pagination (default: 0)
 * @query limit - Number of records to return (default: 10)
 * @route GET /admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const { search = "", skip = 0, limit = 10 } = req.query;

    // Build search query
    const query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get paginated users
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: users,
      total,
      skip: Number(skip),
      limit: Number(limit),
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
