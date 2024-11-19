import mongoose from "mongoose";

const QaCommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
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
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QaComment",
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QaComment", QaCommentSchema);
