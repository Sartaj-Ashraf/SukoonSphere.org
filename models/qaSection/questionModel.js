import mongoose from "mongoose";
import { TAGS } from "../../utils/constants.js";

// Define the schema for Questions
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
    },
    context: {
      type: String,
    },
    author: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: { type: String },
      avatar: { type: String },
    },
    tags: {
      type: [String],
      enum: Object.values(TAGS),
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
  },
  { timestamps: true }
);

// Create the model and the text index
questionSchema.index({ questionText: "text" }); // Create a text index for efficient search

export default mongoose.model("Question", questionSchema);
