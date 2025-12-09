import mongoose, { Schema } from "mongoose";

const blogShcema = new Schema(
  {
    img: {
      type: String,
      required: [true, "Blog image is Requried"],
    },
    category: {
      type: String,
      required: [true, "Category is Required"],
    },

    description: {
      type: String,
      required: [true, "Description Is Required"],
    },
    title: {
      type: String,
      required: [true, "Title Is Required"],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogShcema);

export default Blog;
