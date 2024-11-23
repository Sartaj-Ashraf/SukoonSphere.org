import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    views: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deleted: {
      default: false,
      type: Boolean,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    pdfPath: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "published"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", ArticleSchema);
