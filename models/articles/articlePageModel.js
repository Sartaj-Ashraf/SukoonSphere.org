import mongoose from "mongoose";

const ArticlePageSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  pageOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
  },
  pageNumber: {
    type: Number,
  },
  pageContent: {
    type: String,
  },
});

export default mongoose.model("ArticlePage", ArticlePageSchema);
