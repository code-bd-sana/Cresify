import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    img: {
      type: String,
      required: [true, "Blog image is Required"],
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

const Blog = mongoose.model("blog", BlogSchema);

export default Blog;
