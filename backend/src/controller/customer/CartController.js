import Cart from "../../models/CartModel.js";
import WishList from "../../models/WishListModel.js";

/**
 * Add a product to the cart.
 * If the product exists in the user's wishlist, it will be removed.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Data payload.
 * @param {string} req.body.product - Product ID.
 * @param {string} req.body.user - User ID.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success/failure message.
 */
export const addToCart = async (req, res) => {
  try {
    const data = req.body;
    const { product, user } = data;

    // Check if product is already in the cart
    const isExist = await Cart.findOne({ user, product });

    if (isExist) {
      return res.status(401).json({
        message: "Already added on the cart",
      });
    }

    // Add to Cart
    const newCart = new Cart(data);
    const saved = await newCart.save();

    // Remove from wishlist if exists
    await WishList.findOneAndDelete({ user, product });

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
 * Remove a product from the cart by ID.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - Cart item ID.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response.
 */
export const removeCart = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Cart.deleteOne({ _id: id });

    res.status(200).json({
      message: "Success",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

/**
 * Increase the quantity of a cart item by 1.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - Cart item ID.
 * @param {Object} res - Express response object.
 * @returns {Object} Updated cart item.
 */
export const increaseCount = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await Cart.findByIdAndUpdate(
      id,
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      message: "Count increased successfully",
      cart: updated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

/**
 * Decrease the quantity of a cart item by 1.
 * Count cannot go below 1.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - Cart item ID.
 * @param {Object} res - Express response object.
 * @returns {Object} Updated cart item.
 */
export const decreaseCount = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch cart item
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    // Prevent going below 1
    if (cartItem.count <= 1) {
      return res.status(400).json({
        message: "Count cannot be less than 1",
      });
    }

    const updated = await Cart.findByIdAndUpdate(
      id,
      { $inc: { count: -1 } },
      { new: true }
    );

    res.status(200).json({
      message: "Count decreased successfully",
      cart: updated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

/**
 * Get all cart items of a user.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - User ID.
 * @param {Object} res - Express response object.
 * @returns {Object} List of cart items.
 */
export const myCart = async (req, res) => {
  try {
    const id = req.params.id;
    const myCarts = await Cart.find({ user: id }).populate({
      path: "product",
      populate: {
        path: "seller",
        select: "name",
      },
    }).select("-user");

    res.status(200).json({
      message: "Success",
      data: myCarts,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

/**
 * Clear all cart items of a user.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - User ID.
 * @param {Object} res - Express response object.
 * @returns {Object} Result of deletion.
 */
export const clearAllCart = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Cart.deleteMany({ user: id });

    res.status(200).json({
      message: "Success",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};
