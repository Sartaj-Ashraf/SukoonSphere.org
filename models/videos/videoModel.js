import mongoose from "mongoose";
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);
