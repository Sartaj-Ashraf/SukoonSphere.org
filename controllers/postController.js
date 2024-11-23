import { StatusCodes } from "http-status-codes";
import Post from "../models/postModel.js";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import PostComments from "../models/postCommentsModel.js";
import PostReplies from "../models/postReplyModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { deleteFile } from '../utils/fileUtils.js';

export const createPost = async (req, res) => {
  const newPost = {
    createdBy: req.user.userId,  // Only store user ID
    ...req.body,
  };
  if (req.file) {
    const filepaath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
    newPost.imageUrl = filepaath;
  }
  const post = await Post.create(newPost);
  await User.findByIdAndUpdate(req.user.userId, { $push: { posts: post._id } }, { new: true });
  res.status(StatusCodes.CREATED).json({ msg: "Post uploaded successfully" });
};

export const getAllPosts = async (req, res) => {
  const posts = await Post.aggregate([
    {
      $match: {
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
      $addFields: {
        username: { $arrayElemAt: ["$userDetails.name", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
      }
    },
    {
      $project: {
        userDetails: 0,
        deleted: 0,
        __v: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);
  res.status(StatusCodes.OK).json({ posts });
};

export const getAllPostsByUserId = async (req, res) => {
  const { id: userId } = req.params;
  const posts = await Post.aggregate([
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
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } }
      }
    },
    {
      $project: {
        userDetails: 0,
        __v: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ posts });
};

export const getPostById = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(postId) }
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
        totalComments: { $size: { $ifNull: ["$comments", []] } },
      }
    },
    {
      $project: {
        userDetails: 0
      }
    }
  ]);
  res.status(StatusCodes.OK).json({ post: post[0] });
};

export const likePosts = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new BadRequestError("Post not found");
  }

  if (post?.likes?.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Post unliked successfully", post });
  } else {
    post.likes.push(userId);
    await post.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Post liked successfully", post });
  }
};

export const createPostComment = async (req, res) => {
  const { content } = req.body;
  const { id: postId } = req.params;
  const comment = await PostComments.create({
    postId,
    createdBy: req.user.userId,  // Only store user ID
    content,
  });
  const post = await Post.findById(postId);
  post.comments.push(comment._id);
  await post.save();

  // Fetch comment with current user details for response
  const commentWithUser = await PostComments.aggregate([
    {
      $match: { _id: comment._id }
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
        username: { $arrayElemAt: ["$userDetails.username", 0] },
        userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] }
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
    comment: commentWithUser[0],
  });
};

export const getAllCommentsByPostId = async (req, res) => {
  const { id: postId } = req.params;
  const postComments = await PostComments.aggregate([
    {
      $match: { postId: new mongoose.Types.ObjectId(postId) }
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
        totalReplies: { $size: { $ifNull: ["$replies", []] } },
        totalLikes: { $size: { $ifNull: ["$likes", []] } }
      }
    },
    {
      $project: {
        userDetails: 0,
        __v: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ comments: postComments });
};

export const createReply = async (req, res) => {
  const { content } = req.body;
  const { id: parentId } = req.params;

  const comment = await PostComments.findById(parentId);
  const parentReply = await PostReplies.findById(parentId);

  if (!comment && !parentReply) {
    throw new BadRequestError("Comment or reply not found");
  }

  const reply = await PostReplies.create({
    content,
    createdBy: req.user.userId,
    parentId,
    replyTo: comment ? comment.createdBy : parentReply.createdBy
  });

  if (comment) {
    comment.replies.push(reply._id);
    await comment.save();
  } else if (parentReply) {
    parentReply.replies.push(reply._id);
    await parentReply.save();
  }

  // Fetch reply with current user details for response
  const replyWithUser = await PostReplies.aggregate([
    {
      $match: { _id: reply._id }
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
        totalReplies: { $size: { $ifNull: ["$replies", []] } },
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
    reply: replyWithUser[0],
  });
};

export const getAllRepliesByCommentId = async (req, res) => {
  const { id: commentId } = req.params;
  const replies = await PostReplies.aggregate([
    {
      $match: { parentId: new mongoose.Types.ObjectId(commentId) }
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
        totalReplies: { $size: { $ifNull: ["$replies", []] } },
        totalLikes: { $size: { $ifNull: ["$likes", []] } }
      }
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0,
        __v: 0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(StatusCodes.OK).json({ replies });
};

export const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post = await Post.findById(postId).session(session);
    if (!post) {
      throw new BadRequestError("Post not found");
    }

    if (post.createdBy.toString() !== req.user.userId) {
      throw new UnauthorizedError("You are not authorized to delete this post");
    }

    // Delete the image if it exists
    if (post.imageUrl) {
      console.log('Deleting image:', post.imageUrl);
      await deleteFile(post.imageUrl);
    }

    const comments = await PostComments.find({ postId }).session(session);

    const commentIds = comments.map((comment) => comment._id);
    await PostReplies.deleteMany({ parentId: { $in: commentIds } }).session(
      session
    );

    await PostComments.deleteMany({ postId }).session(session);
    await Post.findByIdAndDelete(postId).session(session);

    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { posts: postId } },
      { session }
    );

    await session.commitTransaction();
    res.status(StatusCodes.OK).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error('Error deleting post:', error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deletePostComment = async (req, res) => {
  const { id: commentId } = req.params;

  // Find the comment first to check ownership
  const comment = await PostComments.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  // Check if user is authorized to delete the comment
  if (comment.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError(
      "You are not authorized to delete this comment"
    );
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  await PostReplies.deleteMany({ parentId: commentId }).session(session);

  // Delete the comment itself
  await PostComments.findByIdAndDelete(commentId).session(session);

  await Post.findByIdAndUpdate(
    comment.postId,
    { $pull: { comments: commentId } },
    { session }
  );

  await session.commitTransaction();
  res
    .status(StatusCodes.OK)
    .json({ message: "Comment and associated replies deleted successfully" });
  session.endSession();
};

export const deletePostCommentReply = async (req, res) => {
  const { id: replyId } = req.params;
  const reply = await PostReplies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }
  if (reply.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError("You are not authorized to delete this reply");
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  await PostReplies.findByIdAndDelete(replyId).session(session);

  // Remove reply from comment's replies array
  await PostComments.findByIdAndUpdate(
    reply.parentId,
    { $pull: { replies: replyId } },
    { session }
  );

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
  session.endSession();
};

export const likePostComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user.userId;

  const comment = await PostComments.findById(commentId);

  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  const isLiked = comment.likes.includes(userId);
  const update = isLiked
    ? { $pull: { likes: userId } }
    : { $push: { likes: userId } };

  const updatedComment = await PostComments.findByIdAndUpdate(
    commentId,
    update,
    { new: true }
  );

  const message = isLiked
    ? "Comment unliked successfully"
    : "Comment liked successfully";

  res.status(StatusCodes.OK).json({
    message,
    comment: updatedComment,
  });
};

export const likePostCommentReply = async (req, res) => {
  const { id: replyId } = req.params;
  const userId = req.user.userId;
  const reply = await PostReplies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }
  const isLiked = reply.likes.includes(userId);
  const update = isLiked
    ? { $pull: { likes: userId } }
    : { $push: { likes: userId } };

  const updatedReply = await PostReplies.findByIdAndUpdate(replyId, update, {
    new: true,
  });
  const message = isLiked
    ? "Reply unliked successfully"
    : "Reply liked successfully";

  res.status(StatusCodes.OK).json({
    message,
    reply: updatedReply,
  });
};
