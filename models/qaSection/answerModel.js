import mongoose from "mongoose";

const Answer = new mongoose.Schema(
  {
    context: {
      type: String,
      required: true,
    },
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QaComment",
      },
    ],
    answeredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Answer", Answer);
