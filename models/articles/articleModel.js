import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    views: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deleted: {
        default: false,
        type: Boolean,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    pages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArticlePage",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "approved", "rejected"],
    },
    coverPage: {
        type: String,
    }
});

export default mongoose.model("Article", ArticleSchema);
