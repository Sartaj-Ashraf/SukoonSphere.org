import Question from "../models/qaSection/questionModel.js"; // Adjust the import based on your project structure
import Answer from "../models/qaSection/answerModel.js";
import Comment from "../models/qaSection/answerCommentModel.js";
import Replies from "../models/qaSection/answerReplyModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/customErors.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
// question controllers
export const addQuestion = async (req, res) => {
  const { questionText, context, tags } = req.body;
  const { userId, username, avatar } = req.user;

  const similarQuestions = await Question.find({
    $text: { $search: questionText },
  }).select("-answers");

  if (similarQuestions.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Similar questions already exist.",
      similarQuestions,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const newQuestion = await Question.create(
    [
      {
        questionText,
        context,
        author: {
          userId,
          username,
          avatar,
        },
        tags,
      },
    ],
    { session }
  );

  await User.findByIdAndUpdate(
    userId,
    { $push: { questions: newQuestion[0]._id } },
    { session }
  );

  await session.commitTransaction();
  session.endSession();

  res.status(StatusCodes.CREATED).json({
    msg: "Question added successfully",
    question: newQuestion[0],
  });
};
export const getAllQuestions = async (req, res) => {
  const questions = await Question.find({}).lean();

  const questionsWithCounts = questions.map((question) => ({
    ...question,
    totalAnswers: (question.answers || []).length,
  }));

  res.status(StatusCodes.OK).json({ questions: questionsWithCounts });
};
export const getUserQuestions = async (req, res) => {
  const { id: userId } = req.params;
  const questions = await Question.find({ "author.userId": userId }).lean();

  const questionsWithCounts = questions.map((question) => ({
    ...question,
    totalAnswers: (question.answers || []).length,
  }));

  res.status(StatusCodes.OK).json({ questions: questionsWithCounts });
};

export const getAllQuestionsWithAnswer = async (req, res) => {
  // Find questions with answers and populate the answers field
  const questions = await Question.find({
    answers: { $exists: true, $not: { $size: 0 } },
  })
    .populate("answers")
    .lean();

  const questionsWithAnswerDetails = questions?.map((question) => {
    // Find the most liked answer by comparing likes array lengths
    const mostLikedAnswer = question.answers.reduce((prev, curr) => {
      const prevLikes = prev.likes?.length || 0;
      const currLikes = curr.likes?.length || 0;
      return prevLikes > currLikes ? prev : curr;
    }, question.answers[0]);

    // Add totalLikes and totalComments to each answer
    const answersWithCounts = question.answers.map((answer) => ({
      ...answer,
      totalLikes: answer.likes?.length || 0,
      totalComments: answer.comments?.length || 0,
    }));

    return {
      ...question,
      answers: answersWithCounts,
      totalAnswers: question.answers.length,
      mostLikedAnswer: {
        ...mostLikedAnswer,
        totalLikes: mostLikedAnswer.likes?.length || 0,
        totalComments: mostLikedAnswer.comments?.length || 0,
      },
    };
  });

  if (!questionsWithAnswerDetails.length) {
    return res.status(StatusCodes.OK).json({ questions: [] });
  }

  res.status(StatusCodes.OK).json({ questions: questionsWithAnswerDetails });
};

// answer controllers
export const createAnswer = async (req, res) => {
  const { userId, username, avatar } = req.user;
  const { id: questionId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) {
      throw new BadRequestError("Question not found");
    }

    const newAnswer = await Answer.create(
      [
        {
          context: req.body.context,
          author: {
            userId,
            username,
            avatar,
          },
          answeredTo: questionId,
        },
      ],
      { session }
    );

    // Add the answer to the question's 'answers' array
    question.answers.push(newAnswer[0]._id);
    await question.save({ session });

    // Update user's answers array
    const user = await User.findById(userId).session(session);
    user.answers.push(newAnswer[0]._id);
    await user.save({ session });

    await session.commitTransaction();

    // Send success response
    res.status(StatusCodes.CREATED).json({
      msg: "Answer added successfully",
      answer: newAnswer[0],
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
export const getAnswerById = async (req, res) => {
  const { id: answerId } = req.params;
  const answer = await Answer.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(answerId) } },
    {
      $addFields: {
        totalComments: { $size: "$comments" },
        totalLikes: { $size: "$likes" },
      },
    },
  ]);

  if (!answer[0]) {
    throw new BadRequestError("Answer not found");
  }

  // Get the question this answer belongs to
  const question = await Question.findById(answer[0].answeredTo);
  if (!question) {
    throw new BadRequestError("Question not found");
  }

  // Get total answers for the question
  const totalAnswers = await Answer.countDocuments({
    answeredTo: question._id,
  });

  // Add totalAnswers to question object
  const questionWithTotal = {
    ...question.toObject(),
    totalAnswers,
  };

  res.status(StatusCodes.OK).json({
    answer: answer[0],
    question: questionWithTotal,
  });
};
export const getAnswersByQuestionId = async (req, res) => {
  const { id: questionId } = req.params;

  // Find the question first
  const question = await Question.findById(questionId);
  if (!question) {
    throw new BadRequestError("Question not found");
  }

  // Find all answers for the given questionId and populate comments count
  const answers = await Answer.aggregate([
    { $match: { answeredTo: new mongoose.Types.ObjectId(questionId) } },
    {
      $addFields: {
        totalComments: { $size: "$comments" },
        totalLikes: { $size: "$likes" },
      },
    },
  ]);

  // Check if no answers are found
  if (answers.length === 0) {
    throw new BadRequestError("No answers found for this question.");
  }

  // Add totalAnswers property to the question
  const questionWithTotalAnswers = {
    ...question.toObject(),
    totalAnswers: answers.length,
  };

  // Respond with both question (including totalAnswers) and answers
  res.status(StatusCodes.OK).json({
    question: questionWithTotalAnswers,
    answers,
  });
};
export const getUserAnswers = async (req, res) => {
  const { id: userId } = req.params;
  const answers = await Answer.aggregate([
    { $match: { "author.userId": new mongoose.Types.ObjectId(userId) } },
    {
      $addFields: {
        totalComments: { $size: "$comments" },
        totalLikes: { $size: "$likes" },
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ answers });
};
// answer comment controllers
export const createAnswerComment = async (req, res) => {
  const { content } = req.body;
  const { id: postId } = req.params;
  const comment = await Comment.create({
    postId,
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
    content,
  });
  const answer = await Answer.findById(postId);
  answer.comments.push(comment._id);
  await answer.save();

  res.status(StatusCodes.CREATED).json({
    message: "Comment created successfully",
    comment,
  });
};
export const getAllCommentsByAnswerId = async (req, res) => {
  const { id: postId } = req.params;
  const postComments = await Comment.aggregate([
    { $match: { postId: new mongoose.Types.ObjectId(postId) } },
    {
      $addFields: {
        repliesLength: { $size: "$replies" },
        totalLikes: { $size: "$likes" },
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ comments: postComments });
};
// answerReply controllers
export const createAnswerReply = async (req, res) => {
  const { content } = req.body;
  const { id: parentId } = req.params;

  const comment = await Comment.findById(parentId);
  const parentReply = await Replies.findById(parentId);

  if (!comment && !parentReply) {
    throw new BadRequestError("comment or reply not found");
  }

  const reply = await Replies.create({
    commentId: comment ? comment._id : parentReply.commentId,
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
    content,
    commentUserId: comment ? comment.createdBy : parentReply.createdBy,
    commentUsername: comment ? comment.username : parentReply.username,
    commentUserAvatar: comment ? comment.userAvatar : parentReply.userAvatar,
  });

  comment.replies.push(reply._id);
  await comment.save();
  res.status(StatusCodes.CREATED).json({
    message: "Reply created successfully",
    reply,
  });
};
export const getAllAnswerRepliesBYCommentId = async (req, res) => {
  const { id: commentId } = req.params;
  const replies = await Replies.find({ commentId }).lean();
  if (replies.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "No replies found for this comment", replies: [] });
  }

  const repliesWithCounts = replies.map((reply) => ({
    ...reply,
    totalLikes: (reply.likes || []).length,
  }));

  res.status(StatusCodes.OK).json({ replies: repliesWithCounts });
};
// delete controllers
export const deleteQuestion = async (req, res) => {
  const { id: postId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  const question = await Question.findById(postId).session(session);
  if (!question) {
    throw new BadRequestError("Question not found");
  }
  console.log({
    question,
    user: req.user,
  });
  if (
    question.author.userId.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    throw new UnauthorizedError(
      "You are not authorized to delete this question"
    );
  }

  const answers = await Answer.find({ answeredTo: postId }).session(session);
  if (answers.length > 0) {
    const answerIds = answers.map((answer) => answer._id);

    const comments = await Comment.find({
      postId: { $in: answerIds },
    }).session(session);
    if (comments.length > 0) {
      const commentIds = comments.map((comment) => comment._id);

      await Replies.deleteMany({ commentId: { $in: commentIds } }).session(
        session
      );

      await Comment.deleteMany({ postId: { $in: answerIds } }).session(session);
    }

    await Answer.deleteMany({ answeredTo: postId }).session(session);
  }

  // Remove question from user's questions array
  const user = await User.findById(question.author.userId).session(session);
  if (user) {
    user.questions.pull(postId);
    await user.save({ session });
  }

  await Question.deleteOne({ _id: postId }).session(session);

  await session.commitTransaction();
  session.endSession();

  res.status(StatusCodes.OK).json({
    message: "Question deleted successfully",
  });
};

export const deleteAnswer = async (req, res) => {
  const { id: answerId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);
    if (!answer) {
      throw new BadRequestError("Answer not found");
    }

    if (
      answer.author.userId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      throw new UnauthorizedError(
        "You are not authorized to delete this answer"
      );
    }

    // Find comments first so we can get their IDs for deleting replies
    const comments = await Comment.find({ postId: answerId }).session(session);
    const commentIds = comments.map((comment) => comment._id);

    // Delete all replies to comments
    await Replies.deleteMany({ commentId: { $in: commentIds } }).session(
      session
    );

    // Delete all comments
    await Comment.deleteMany({ postId: answerId }).session(session);

    // Remove answer from question's answers array
    const question = await Question.findOne({ answers: answerId }).session(
      session
    );
    if (question) {
      question.answers.pull(answerId);
      await question.save({ session });
    }

    // Remove answer from user's answers array
    const user = await User.findById(req.user.userId).session(session);
    if (user) {
      user.answers.pull(answerId);
      await user.save({ session });
    }

    // Delete the answer itself
    await Answer.deleteOne({ _id: answerId }).session(session);

    await session.commitTransaction();
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteAnswerComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError(
      "You are not authorized to delete this comment"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  await Replies.deleteMany({ commentId }).session(session);

  // Delete the comment itself
  await Comment.findByIdAndDelete(commentId).session(session);

  // Remove comment from answer's comments array
  const answer = await Answer.findOne({ comments: commentId }).session(session);
  if (answer) {
    answer.comments.pull(commentId);
    await answer.save({ session });
  }

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ message: "Comment deleted successfully" });
  session.endSession();
};
export const deleteAnswerReply = async (req, res) => {
  const { id: replyId } = req.params;

  const reply = await Replies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError("You are not authorized to delete this reply");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  // Delete the reply
  await Replies.findByIdAndDelete(replyId).session(session);

  // Remove reply from comment's replies array
  const comment = await Comment.findOne({ replies: replyId }).session(session);
  if (comment) {
    comment.replies.pull(replyId);
    await comment.save({ session });
  }

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
  session.endSession();
};

// like controllers
export const likeAnswer = async (req, res) => {
  const { id: answerId } = req.params;
  const { userId } = req.user;

  // First find the answer to check if it exists
  const existingAnswer = await Answer.findById(answerId);
  console.log({ existingAnswer });
  if (!existingAnswer) {
    throw new BadRequestError("Answer not found");
  }

  // Check if user has already liked
  const hasLiked = existingAnswer.likes.includes(userId);

  // Update likes array based on whether user has already liked
  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      [hasLiked ? "$pull" : "$push"]: { likes: userId },
    },
    { new: true }
  );

  // Update total likes count
  updatedAnswer.totalLikes = updatedAnswer.likes.length;
  await updatedAnswer.save();

  res.status(StatusCodes.OK).json({
    message: "success",
    likes: updatedAnswer.likes,
    totalLikes: updatedAnswer.totalLikes,
  });
};
export const likeAnswerComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { userId } = req.user;

  try {
    // First find the comment to check if it exists
    const existingComment = await Comment.findById(commentId);
    console.log({ existingComment });
    if (!existingComment) {
      throw new BadRequestError("Comment not found");
    }

    // Check if user has already liked
    const hasLiked = existingComment.likes.includes(userId);

    // Update likes array based on whether user has already liked
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        [hasLiked ? "$pull" : "$push"]: { likes: userId },
      },
      { new: true }
    ).exec(); // Add .exec() to ensure promise resolution

    if (!updatedComment) {
      throw new BadRequestError("Failed to update comment");
    }

    // Update total likes count
    updatedComment.totalLikes = updatedComment.likes.length;
    await updatedComment.save();

    res.status(StatusCodes.OK).json({
      message: "success",
      likes: updatedComment.likes,
      totalLikes: updatedComment.totalLikes,
    });
  } catch (error) {
    console.error("Error in likeAnswerComment:", error);
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message || "Comment not found",
    });
  }
};
export const likeAnswerReply = async (req, res) => {
  const { id: replyId } = req.params;
  const { userId } = req.user;

  try {
    // First find the reply to check if it exists
    const existingReply = await Replies.findById(replyId);
    if (!existingReply) {
      throw new BadRequestError("Reply not found");
    }

    // Check if user has already liked
    const hasLiked = existingReply.likes.includes(userId);

    // Update likes array based on whether user has already liked
    const updatedReply = await Replies.findByIdAndUpdate(
      replyId,
      {
        [hasLiked ? "$pull" : "$push"]: { likes: userId },
      },
      { new: true }
    ).exec();

    if (!updatedReply) {
      throw new BadRequestError("Failed to update reply");
    }

    // Update total likes count
    updatedReply.totalLikes = updatedReply.likes.length;
    await updatedReply.save();

    res.status(StatusCodes.OK).json({
      message: "success",
      likes: updatedReply.likes,
      totalLikes: updatedReply.totalLikes,
    });
  } catch (error) {
    console.error("Error in likeAnswerReply:", error);
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message || "Reply not found",
    });
  }
};
