import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    views: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    deleted: {
      default: false,
      type: Boolean,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pdfPath: {
      type: String,
      required: true,
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
