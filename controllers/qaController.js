import Question from "../models/qaSection/questionModel.js"; // Adjust the import based on your project structure
import Answer from "../models/qaSection/answerModel.js";
import Comment from "../models/qaSection/answerCommentModel.js";
import Replies from "../models/qaSection/answerReplyModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/customErors.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
// question controllers
export const addQuestion = async (req, res) => {
  const { questionText, context, tags } = req.body;
  const { userId } = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();

  const newQuestion = await Question.create(
    [
      {
        questionText,
        context,
        createdBy: userId,  // Only store user ID
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

  // Fetch question with user details for response
  const questionWithUser = await Question.aggregate([
    {
      $match: { _id: newQuestion[0]._id }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    }
  ]);

  await session.commitTransaction();
  session.endSession();

  res.status(StatusCodes.CREATED).json({
    msg: "Question added successfully",
    question: questionWithUser[0],
  });
};

export const getAllQuestions = async (req, res) => {
  const questions = await Question.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
        },
        totalAnswers: { $size: { $ifNull: ["$answers", []] } }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ questions });
};


export const getUserQuestions = async (req, res) => {
  const { id: userId } = req.params;
  const questions = await Question.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(userId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        totalAnswers: { $size: { $ifNull: ["$answers", []] } }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ questions });
};

export const getAllQuestionsWithAnswer = async (req, res) => {
  const questions = await Question.aggregate([
    {
      $match: {
        answers: { $exists: true, $not: { $size: 0 } }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "answers",
        localField: "answers",
        foreignField: "_id",
        as: "answers"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "answers.createdBy",
        foreignField: "_id",
        as: "answerUserDetails"
      }
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
        },
        totalAnswers: { $size: "$answers" },
        answers: {
          $map: {
            input: "$answers",
            as: "answer",
            in: {
              _id: "$$answer._id",
              context: "$$answer.context",
              createdBy: "$$answer.createdBy",
              likes: "$$answer.likes",
              comments: "$$answer.comments",
              createdAt: "$$answer.createdAt",
              updatedAt: "$$answer.updatedAt",
              author: {
                userId: "$$answer.createdBy",
                username: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$answerUserDetails",
                              cond: { $eq: ["$$this._id", "$$answer.createdBy"] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: "$$user.name"
                  }
                },
                userAvatar: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$answerUserDetails",
                              cond: { $eq: ["$$this._id", "$$answer.createdBy"] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: "$$user.avatar"
                  }
                }
              },
              totalLikes: { $size: { $ifNull: ["$$answer.likes", []] } },
              totalComments: { $size: { $ifNull: ["$$answer.comments", []] } }
            }
          }
        }
      }
    },
    {
      $addFields: {
        mostLikedAnswer: {
          $reduce: {
            input: "$answers",
            initialValue: { totalLikes: -1 },
            in: {
              $cond: [
                { $gt: ["$$this.totalLikes", "$$value.totalLikes"] },
                "$$this",
                "$$value"
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        userDetails: 0,
        answerUserDetails: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ questions });
};

// answer controllers
export const createAnswer = async (req, res) => {
  const { userId } = req.user;
  const { id: questionId } = req.params;
  const { context } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // First verify the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question not found");
    }

    const newAnswer = await Answer.create(
      [
        {
          context,
          createdBy: userId,
          answeredTo: questionId,
        },
      ],
      { session }
    );

    await Question.findByIdAndUpdate(
      questionId,
      { $push: { answers: newAnswer[0]._id } },
      { session }
    );

    await User.findByIdAndUpdate(
      userId,
      { $push: { answers: newAnswer[0]._id } },
      { session }
    );

    // Fetch answer with user details
    const answerWithUser = await Answer.aggregate([
      {
        $match: { _id: newAnswer[0]._id }
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $addFields: {
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } }
        }
      },
      {
        $project: {
          userDetails: 0
        }
      }
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({
      msg: "Answer created successfully",
      answer: answerWithUser[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const getAnswerById = async (req, res) => {
  const { id: answerId } = req.params;

  // First get the answer with user details and comment count
  const answer = await Answer.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(answerId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "qacomments",
        localField: "comments",
        foreignField: "_id",
        as: "commentDetails"
      }
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
        },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: "$commentDetails" }
      }
    },
    {
      $project: {
        userDetails: 0,
        commentDetails: 0
      }
    }
  ]);

  if (!answer.length) {
    throw new NotFoundError("Answer not found");
  }

  // Then get the question this answer belongs to
  const question = await Question.aggregate([
    {
      $match: { _id: answer[0].answeredTo }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "answers",
        localField: "answers",
        foreignField: "_id",
        as: "answers"
      }
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
        },
        totalAnswers: { $size: "$answers" }
      }
    },
    {
      $project: {
        userDetails: 0,
        answers: 0
      }
    }
  ]);

  if (!question.length) {
    throw new NotFoundError("Question not found");
  }

  res.status(StatusCodes.OK).json({
    answer: answer[0],
    question: question[0]
  });
};
export const getAnswersByQuestionId = async (req, res) => {
  const { id: questionId } = req.params;

  // First get the question with user details
  const question = await Question.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(questionId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "answers",
        localField: "answers",
        foreignField: "_id",
        as: "answers"
      }
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
        },
        totalAnswers: { $size: "$answers" }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    }
  ]);

  if (!question.length) {
    throw new NotFoundError("Question not found");
  }

  // Then get all answers with user details
  const answers = await Answer.aggregate([
    {
      $match: { answeredTo: new mongoose.Types.ObjectId(questionId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "qacomments",
        localField: "comments",
        foreignField: "_id",
        as: "comments"
      }
    },
    {
      $addFields: {
        author: {
          userId: "$createdBy",
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
        },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({
    question: question[0],
    answers
  });
};
export const getUserAnswers = async (req, res) => {
  const { id: userId } = req.params;
  const answers = await Answer.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(userId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "questions",
        localField: "answeredTo",
        foreignField: "_id",
        as: "question"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
        question: { $arrayElemAt: ["$question", 0] }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ answers });
};
// answer comment controllers
export const createAnswerComment = async (req, res) => {
  const { content } = req.body;
  const { id: answerId } = req.params;

  const comment = await Comment.create({
    answerId,
    createdBy: req.user.userId,
    content,
  });

  const answer = await Answer.findById(answerId);
  answer.comments.push(comment._id);
  await answer.save();

  // Get the created comment with user details
  const commentWithUser = await Comment.aggregate([
    { $match: { _id: comment._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $addFields: {
        createdBy: "$createdBy",
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        repliesLength: { $size: { $ifNull: ["$replies", []] } },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalReplies: { $size: { $ifNull: ["$replies", []] } }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    }
  ]);

  res.status(StatusCodes.CREATED).json({
    message: "Comment created successfully",
    comment: commentWithUser[0]
  });
};

export const getAllCommentsByAnswerId = async (req, res) => {
  const { id: answerId } = req.params;
  const comments = await Comment.aggregate([
    {
      $match: {
        answerId: new mongoose.Types.ObjectId(answerId),
        deleted: { $ne: true }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $lookup: {
        from: "answerreplies",
        localField: "replies",
        foreignField: "_id",
        as: "repliesData"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        repliesLength: { $size: { $ifNull: ["$replies", []] } },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalReplies: { $size: { $ifNull: ["$replies", []] } }
      }
    },
    {
      $project: {
        userDetails: 0,
        repliesData: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ comments });
};

// Reply controllers
export const createAnswerReply = async (req, res) => {
  const { content } = req.body;
  const { id: parentId } = req.params;

  const comment = await Comment.findById(parentId);
  const parentReply = await Replies.findById(parentId);

  if (!comment && !parentReply) {
    throw new BadRequestError("Comment or reply not found");
  }

  const reply = await Replies.create({
    commentId: comment ? comment._id : parentReply.commentId,
    parentId: parentReply ? parentReply._id : null,
    createdBy: req.user.userId,
    content,
    replyTo: comment ? comment.createdBy : parentReply.createdBy
  });

  if (comment) {
    comment.replies.push(reply._id);
    await comment.save();
  }

  // Get the created reply with user details
  const replyWithUser = await Replies.aggregate([
    { $match: { _id: reply._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorDetails"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "replyTo",
        foreignField: "_id",
        as: "replyToDetails"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$authorDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: "$replyTo",
        totalLikes: { $size: { $ifNull: ["$likes", []] } }
      }
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0
      }
    }
  ]);

  res.status(StatusCodes.CREATED).json({
    message: "Reply created successfully",
    reply: replyWithUser[0]
  });
};

export const getAllAnswerRepliesByCommentId = async (req, res) => {
  const { id: commentId } = req.params;

  const replies = await Replies.aggregate([
    {
      $match: {
        commentId: new mongoose.Types.ObjectId(commentId),
        deleted: { $ne: true }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorDetails"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "replyTo",
        foreignField: "_id",
        as: "replyToDetails"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$authorDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: "$replyTo",
        totalLikes: { $size: { $ifNull: ["$likes", []] } }
      }
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  if (replies.length === 0) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "No replies found for this comment", replies: [] });
  }

  res.status(StatusCodes.OK).json({ replies });
};

export const likeAnswerReply = async (req, res) => {
  const { id: replyId } = req.params;
  const userId = req.user.userId;

  const reply = await Replies.findById(replyId);
  if (!reply) {
    throw new NotFoundError("Reply not found");
  }

  const isLiked = reply.likes.includes(userId);
  if (isLiked) {
    reply.likes = reply.likes.filter((id) => id.toString() !== userId);
  } else {
    reply.likes.push(userId);
  }
  await reply.save();

  const replyWithDetails = await Replies.aggregate([
    { $match: { _id: reply._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "authorDetails"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "replyTo",
        foreignField: "_id",
        as: "replyToDetails"
      }
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$authorDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: "$replyTo",
        totalLikes: { $size: "$likes" }
      }
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0
      }
    }
  ]);

  res.status(StatusCodes.OK).json({
    message: isLiked ? "Reply unliked" : "Reply liked",
    reply: replyWithDetails[0]
  });
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

// Like controllers for comments and replies
export const likeAnswerComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user.userId;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  const isLiked = comment.likes.includes(userId);
  if (isLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
  } else {
    comment.likes.push(userId);
  }
  await comment.save();

  const commentWithDetails = await Comment.aggregate([
    { $match: { _id: comment._id } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $addFields: {
        createdBy: "$createdBy",
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        totalLikes: { $size: "$likes" }
      }
    },
    {
      $project: {
        userDetails: 0
      }
    }
  ]);

  res.status(StatusCodes.OK).json({
    message: isLiked ? "Comment unliked" : "Comment liked",
    comment: commentWithDetails[0]
  });
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
    question.createdBy.toString() !== req.user.userId &&
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
  const user = await User.findById(question.createdBy).session(session);
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
      answer.createdBy.toString() !== req.user.userId &&
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
