import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      default: "Other",
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/300x200.png?text=No+Thumbnail",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog ", blogSchema);

export default Blog;
