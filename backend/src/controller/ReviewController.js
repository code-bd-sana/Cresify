import Product from "../models/ProductModel.js";
import Review from "../models/ReviewModel.js";
import User from "../models/UserModel.js";

export const saveReview = async (req, res) => {
  console.log(req.body, "reviw preview");
  try {
    const data = req.body;
    console.log(data, "data re data kaga");

    const sellerId = await Product.findOne({ _id: data?.review?.productId });

    const reviewData = {
      user: data?.id,
      rating: data?.rating,
      review: data?.reviewText,
      product: data?.review?.productId,
      seller: sellerId?.seller,
      provider: data?.provider,
    };

    const newReview = new Review(reviewData);
    const saved = await newReview.save();
    res.status(200).json({
      message: "Success",
      data: saved,
    });
  } catch (error) {

    console.log(error, 'eta ami chai allah');
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Review.deleteOne({ _id: id });
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

export const postReview = async (req, res) => {
  try {
    const { id, reply } = req.body;
    const udpated = await Review.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          reply: reply,
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: udpated,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};

export const getReviewByProducts = async (req, res) => {
  try {
    const id = req.params.id;
    const reviews = await Review.find({ product: id }).populate("user");
    res.status(200).json({
      message: "Success",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};



export const getReviewBySellerId = async (req, res) => {
  try {
    const userId = req.params.id;

    // User role fetch করা
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let filter = {};
    if (user.role === "provider") {
      filter.provider = userId; // provider reviews
    } else if (user.role === "seller") {
      filter.seller = userId; // seller reviews
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    const reviews = await Review.find(filter).populate("user product");

    res.status(200).json({
      message: "Success",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Something went wrong",
      error,
    });
  }
};

export const getReviewByProviderId = async (req, res) => {
  try {
    const id = req.params.id;
    const reviews = await Review.find({ provider: id }).populate("user product");
    res.status(200).json({
      message: "Success",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};




export const updateReview = async (req, res) => {
  try {
    const { id, reply } = req.body;

    if (!id || !reply) {
      return res.status(400).json({
        success: false,
        message: "Review ID and reply are required",
      });
    }

    const updatedReview = await Review.updateOne(
      { _id: id },
      {
        $set: {
          reply: reply,
        },
      }
    );

    if (updatedReview.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reply updated successfully",
    });

  } catch (error) {
    console.error("Update review error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
