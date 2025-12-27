import Product from "../models/ProductModel.js";
import Review from "../models/ReviewModel.js";

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
    const id = req.params.id;
    const reviews = await Review.find({ seller: id }).populate("user product");
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
