import { StatusCodes } from "http-status-codes";
import Post from "../models/postModel.js";
import { formatImage } from "../middleware/multer.js";
import cloudinary from "cloudinary";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import PostComments from "../models/postCommentsModel.js";
import PostReplies from "../models/postReplyModel.js";
import postModel from "../models/postModel.js";
import postReplyModel from "../models/postReplyModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  const newPost = {
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
    ...req.body,
  };
  console.log({ req });
  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newPost.imageUrl = response.secure_url;
    newPost.imagePublicId = response.public_id;
  }
  const post = await Post.create(newPost);

  // Add post ID to user's posts array
  await User.findByIdAndUpdate(
    req.user.userId,
    { $push: { posts: post._id } },
    { new: true }
  );

  res.status(StatusCodes.CREATED).json({ msg: "Post uploaded successfully" });
};
export const getAllPosts = async (req, res) => {
  const posts = await Post.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $addFields: {
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ posts });
};
export const getPostById = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(postId) },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $addFields: {
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
      },
    },
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
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
    content,
  });
  const post = await Post.findById(postId);
  post.comments.push(comment._id);
  await post.save();
  res.status(StatusCodes.CREATED).json({
    message: "Comment created successfully",
    comment,
  });
};
export const getAllCommentsByPostId = async (req, res) => {
  const { id: postId } = req.params;
  const postComments = await PostComments.find({ postId })
    .select("-__v")
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
    .lean();

  const commentsWithReplies = postComments.map((comment) => ({
    ...comment,
    totalReplies: (comment.replies || []).length,
    totalLikes: (comment.likes || []).length,
  }));

  res.status(StatusCodes.OK).json({ comments: commentsWithReplies });
};
export const getAllPostsByUserId = async (req, res) => {
  const { userId } = req.user;
  const posts = await postModel
    .find({ createdBy: userId })
    .select("-__v")
    .lean();

  const postsWithCounts = posts.map((post) => ({
    ...post,
    totalLikes: (post.likes || []).length,
    totalComments: (post.comments || []).length,
  }));

  res.status(StatusCodes.OK).json({
    posts: postsWithCounts,
  });
};
export const createReply = async (req, res) => {
  const { content } = req.body;
  const { id: parentId } = req.params;

  const comment = await PostComments.findById(parentId);
  const parentReply = await PostReplies.findById(parentId);

  if (!comment && !parentReply) {
    throw new BadRequestError("Parent comment or reply not found");
  }

  const reply = await PostReplies.create({
    commentId: comment ? comment._id : parentReply.commentId,
    parentId: parentReply ? parentReply._id : null,
    createdBy: req.user.userId,
    username: req.user.username,
    userAvatar: req.user.avatar,
    content,
    commentUserId: comment ? comment.createdBy : parentReply.createdBy,
    commentUsername: comment ? comment.username : parentReply.username,
    commentUserAvatar: comment ? comment.userAvatar : parentReply.userAvatar,
  });

  if (comment) {
    comment.replies.push(reply._id);
    await comment.save();
  }

  res.status(StatusCodes.CREATED).json({
    message: "Reply created successfully",
    reply,
  });
};
export const getAllRepliesByCommentId = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await PostComments.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  const replies = await postReplyModel
    .find({ commentId })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  const repliesWithCounts = replies.map((reply) => ({
    ...reply,
    totalLikes: (reply.likes || []).length,
  }));

  res.status(StatusCodes.OK).json({
    replies: repliesWithCounts,
  });
};

export const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  const post = await Post.findById(postId).session(session);
  if (!post) {
    throw new BadRequestError("Post not found");
  }

  if (post.createdBy.toString() !== req.user.userId) {
    throw new UnauthorizedError("You are not authorized to delete this post");
  }

  const comments = await PostComments.find({ postId }).session(session);

  const commentIds = comments.map((comment) => comment._id);
  await PostReplies.deleteMany({ commentId: { $in: commentIds } }).session(
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

  session.endSession();
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

  await PostReplies.deleteMany({ commentId }).session(session);

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
    reply.commentId,
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
