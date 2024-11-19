import mongoose from "mongoose";

    const replySchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply", // Allows referencing another reply for nested replies
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reply", replySchema);
