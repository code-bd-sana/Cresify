import WishList from "../../models/WishListModel.js";

/**
 * Check if a product is in the user's wishlist.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the product to check.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.userId - The ID of the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating existence.
 */
export const checkWishList = async (req, res) => {
  try {
    // userId is now in params based on route /check/:id/:userId
    const { id, userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const existingWishList = await WishList.findOne({
      product: id,
      user: userId,
    });

    res.status(200).json({
      message: "Success",
      exists: !!existingWishList,
      wishlistId: existingWishList?._id || null,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message || "Internal Server Error",
    });
  }
};

/**
 * Add a product to the customer's wishlist.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing wishlist data.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure.
 */
export const addToWishList = async (req, res) => {
  try {
    const data = req.body;

    const existingWishList = await WishList.findOne({
      user: data.user,
      product: data.product,
    });

    if (existingWishList) {
      return res.status(400).json({
        message: "Product already exists in wishlist",
      });
    }

    const newWishList = new WishList(data);
    const saved = await newWishList.save();

    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message || "Internal Server Error",
    });
  }
};

/**
 * Remove a product from the customer's wishlist.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the wishlist item to remove.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response indicating success or failure.
 */
export const removeFromWishList = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WishList.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      message: "Successfully removed from wishlist",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message || "Internal Server Error",
    });
  }
};

/**
 * Get wishlist items for a user with pagination (infinite scroll).
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} req.query - The query parameters.
 * @param {number} [req.query.page=1] - The page number.
 * @param {number} [req.query.limit=10] - The number of items per page.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response containing the list of wishlists and pagination info.
 */
export const getWishList = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch wishlist with optimized lean queries
    const wishlists = await WishList.find({ user: userId })
      .populate({
        path: "product",
        select: "title price image seller stock status", // return only required fields
        populate: {
          path: "seller",
          select: "name shopName", // fetch seller name only
        },
      })
      .populate({
        path: "user",
        select: "name email", // reduce payload
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(); // faster response

    const total = await WishList.countDocuments({ user: userId });
    const hasMore = skip + wishlists.length < total;

    res.status(200).json({
      message: "Success",
      data: wishlists,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message || "Internal Server Error",
    });
  }
};
