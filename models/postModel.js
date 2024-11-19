import mongoose from "mongoose";
import { TAGS } from "../utils/constants.js";

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
    },
    userAvatar: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    datePublished: {
      type: Date,
      default: Date.now,
    },
    tags: {
      type: [String],
      enum: Object.values(TAGS),
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
