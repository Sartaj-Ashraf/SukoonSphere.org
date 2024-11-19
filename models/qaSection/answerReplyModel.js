import mongoose from "mongoose";

const AnswerReplySchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnswerReply",
    },
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
    content: {
      type: String,
      required: true,
    },
    commentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentUsername: {
      type: String,
      required: true,
    },
    commentUserAvatar: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AnswerReply", AnswerReplySchema);
