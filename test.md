import mongoose from "mongoose";

// Define the schema for a Space
const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Space", spaceSchema);
.
.
.
import mongoose from "mongoose";
import { TAGS } from "../../utils/constants.js";

// Define the schema for SpaceQuestions
const spaceQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    context: {
      type: String,
    },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
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
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "SpaceAnswer" }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("SpaceQuestion", spaceQuestionSchema);
.
.
.
import mongoose from "mongoose";

// Define the schema for SpaceAnswers
const spaceAnswerSchema = new mongoose.Schema(
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
    answeredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpaceQuestion",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SpaceAnswer", spaceAnswerSchema);
.
.
.
import mongoose from "mongoose";

// Define the schema for SpaceMember (users joining spaces)
const spaceMemberSchema = new mongoose.Schema(
  {
    spaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
);

export default mongoose.model("SpaceMember", spaceMemberSchema);
.
.
.
import Space from "../models/spaceModel.js";
import SpaceQuestion from "../models/spaceQuestionModel.js";
import SpaceAnswer from "../models/spaceAnswerModel.js";
import SpaceMember from "../models/spaceMemberModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";

// 1. Create a new Space
export const createSpace = async (req, res) => {
  const { name, description } = req.body;
  const existingSpace = await Space.findOne({ name });

  if (existingSpace) {
    throw new BadRequestError("Space with this name already exists.");
  }

  const newSpace = await Space.create({
    name,
    description,
    createdBy: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({
    message: "Space created successfully",
    space: newSpace,
  });
};

// 2. Get all Spaces
export const getAllSpaces = async (req, res) => {
  const spaces = await Space.find();
  res.status(StatusCodes.OK).json({ spaces });
};

// 3. Add a question to a Space
export const addQuestionToSpace = async (req, res) => {
  const { spaceId } = req.params;
  const { questionText, context, tags } = req.body;

  const space = await Space.findById(spaceId);
  if (!space) {
    throw new BadRequestError("Space not found.");
  }

  const newQuestion = await SpaceQuestion.create({
    questionText,
    context,
    tags,
    space: spaceId,
    author: {
      userId: req.user.userId,
      username: req.user.username,
      avatar: req.user.avatar,
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: "Question added to space successfully",
    question: newQuestion,
  });
};

// 4. Get all questions in a Space
export const getQuestionsInSpace = async (req, res) => {
  const { spaceId } = req.params;
  const questions = await SpaceQuestion.find({ space: spaceId });

  if (!questions.length) {
    throw new BadRequestError("No questions found in this space.");
  }

  res.status(StatusCodes.OK).json({ questions });
};

// 5. Join a Space
export const joinSpace = async (req, res) => {
  const { spaceId } = req.params;

  const space = await Space.findById(spaceId);
  if (!space) {
    throw new BadRequestError("Space not found.");
  }

  // Check if user is already a member
  const existingMember = await SpaceMember.findOne({
    spaceId,
    userId: req.user.userId,
  });

  if (existingMember) {
    throw new BadRequestError("You are already a member of this space.");
  }

  // Add user to the space
  const newMember = await SpaceMember.create({
    spaceId,
    userId: req.user.userId,
  });

  res.status(StatusCodes.OK).json({
    message: "You have joined the space successfully",
    member: newMember,
  });
};

// 6. Leave a Space
export const leaveSpace = async (req, res) => {
  const { spaceId } = req.params;

  const space = await Space.findById(spaceId);
  if (!space) {
    throw new BadRequestError("Space not found.");
  }

  const member = await SpaceMember.findOneAndDelete({
    spaceId,
    userId: req.user.userId,
  });

  if (!member) {
    throw new BadRequestError("You are not a member of this space.");
  }

  res.status(StatusCodes.OK).json({
    message: "You have left the space successfully",
  });
};
.
.
.
import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createSpace,
  getAllSpaces,
  addQuestionToSpace,
  getQuestionsInSpace,
  joinSpace,
  leaveSpace,
} from "../controllers/spaceController.js";

const router = Router();

// Space routes
router.post("/", authenticateUser, createSpace); // Create a new space
router.get("/", getAllSpaces); // Get all spaces

// Question routes for a space
router.post("/:spaceId/questions", authenticateUser, addQuestionToSpace); // Add question to space
router.get("/:spaceId/questions", getQuestionsInSpace); // Get all questions in a space

// Join/Leave Space routes
router.post("/:spaceId/join", authenticateUser, joinSpace); // Join a space
router.post("/:spaceId/leave", authenticateUser, leaveSpace); // Leave a space

export default router;
.
.
.
refactor......................
.
.
.
import mongoose from "mongoose";

// Space model
const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // Link to Question model
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Space", spaceSchema);
.
.
.
import mongoose from "mongoose";
import { TAGS } from "../../utils/constants.js";

// SpaceQuestion model
const spaceQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
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
        ref: "User",
      },
    ],
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space", // Link to Space model
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SpaceQuestion", spaceQuestionSchema);
.
.
.
import Space from "../models/space/spaceModel.js";
import SpaceQuestion from "../models/space/spaceQuestionModel.js";
import Answer from "../models/qaSection/answerModel.js";
import Comment from "../models/qaSection/answerCommentModel.js";
import Replies from "../models/qaSection/answerReplyModel.js";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import { StatusCodes } from "http-status-codes";

// Create a new space
export const createSpace = async (req, res) => {
  const { name, description } = req.body;
  const existingSpace = await Space.findOne({ name });

  if (existingSpace) {
    throw new BadRequestError("Space already exists.");
  }

  const newSpace = await Space.create({
    name,
    description,
    createdBy: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Space created successfully",
    space: newSpace,
  });
};

// Join a space
export const joinSpace = async (req, res) => {
  const { spaceId } = req.params;
  const space = await Space.findById(spaceId);

  if (!space) {
    throw new BadRequestError("Space not found");
  }

  // Check if the user is already a member
  if (space.members.includes(req.user.userId)) {
    throw new BadRequestError("You are already a member of this space");
  }

  // Add user to members array
  space.members.push(req.user.userId);
  await space.save();

  res.status(StatusCodes.OK).json({
    msg: "Successfully joined the space",
  });
};

// Leave a space
export const leaveSpace = async (req, res) => {
  const { spaceId } = req.params;
  const space = await Space.findById(spaceId);

  if (!space) {
    throw new BadRequestError("Space not found");
  }

  // Check if the user is a member
  if (!space.members.includes(req.user.userId)) {
    throw new BadRequestError("You are not a member of this space");
  }

  // Remove user from members array
  space.members.pull(req.user.userId);
  await space.save();

  res.status(StatusCodes.OK).json({
    msg: "Successfully left the space",
  });
};

// Add a question to a space
export const addQuestionToSpace = async (req, res) => {
  const { spaceId } = req.params;
  const { questionText, context, tags } = req.body;

  const space = await Space.findById(spaceId);
  if (!space) {
    throw new BadRequestError("Space not found");
  }

  const newQuestion = await SpaceQuestion.create({
    questionText,
    context,
    tags,
    author: {
      userId: req.user.userId,
      username: req.user.username,
      avatar: req.user.avatar,
    },
    space: spaceId,
  });

  space.questions.push(newQuestion._id);
  await space.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Question added to space",
    question: newQuestion,
  });
};

// Get all questions in a space
export const getQuestionsInSpace = async (req, res) => {
  const { spaceId } = req.params;

  const space = await Space.findById(spaceId);
  if (!space) {
    throw new BadRequestError("Space not found");
  }

  const questions = await SpaceQuestion.find({ space: spaceId }).populate("answers");

  res.status(StatusCodes.OK).json({ questions });
};

// Like a question
export const likeQuestion = async (req, res) => {
  const { questionId } = req.params;

  const question = await SpaceQuestion.findById(questionId);
  if (!question) {
    throw new BadRequestError("Question not found");
  }

  if (question.likes.includes(req.user.userId)) {
    question.likes.pull(req.user.userId); // Un-like if already liked
  } else {
    question.likes.push(req.user.userId);
  }

  await question.save();
  res.status(StatusCodes.OK).json({
    msg: "Liked the question",
    likes: question.likes.length,
  });
};

// Like an answer
export const likeAnswer = async (req, res) => {
  const { answerId } = req.params;

  const answer = await Answer.findById(answerId);
  if (!answer) {
    throw new BadRequestError("Answer not found");
  }

  if (answer.likes.includes(req.user.userId)) {
    answer.likes.pull(req.user.userId); // Un-like if already liked
  } else {
    answer.likes.push(req.user.userId);
  }

  await answer.save();
  res.status(StatusCodes.OK).json({
    msg: "Liked the answer",
    likes: answer.likes.length,
  });
};

// Add a comment to an answer
export const addCommentToAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { content } = req.body;

  const answer = await Answer.findById(answerId);
  if (!answer) {
    throw new BadRequestError("Answer not found");
  }

  const comment = await Comment.create({
    content,
    postId: answerId,
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
  });

  answer.comments.push(comment._id);
  await answer.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Comment added to answer",
    comment,
  });
};

// Reply to a comment
export const replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  const reply = await Replies.create({
    commentId,
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
    content,
  });

  comment.replies.push(reply._id);
  await comment.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Reply added to comment",
    reply,
  });
};
.
.
.
import { Router } from "express";
import {
  createSpace,
  joinSpace,
  leaveSpace,
  addQuestionToSpace,
  getQuestionsInSpace,
  likeQuestion,
  likeAnswer,
  addCommentToAnswer,
  replyToComment,
} from "../controllers/spaceController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

// Space routes
router.post("/", authenticateUser, createSpace);
router.post("/:spaceId/join", authenticateUser, joinSpace);
router.post("/:spaceId/leave", authenticateUser, leaveSpace);

// Questions in space
router.post("/:spaceId/questions", authenticateUser, addQuestionToSpace);
router.get("/:spaceId/questions", authenticateUser, getQuestionsInSpace);

// Like question
router.post("/question/:questionId/like", authenticateUser, likeQuestion);

// Like answer
router.post("/answer/:answerId/like", authenticateUser, likeAnswer);

// Add comment to answer
router.post("/answer/:answerId/comment", authenticateUser, addCommentToAnswer);

// Reply to comment
router.post("/comment/:commentId/reply", authenticateUser, replyToComment);

export default router;
