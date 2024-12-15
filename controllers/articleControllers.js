import Article from "../models/articles/articleModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import User from "../models/userModel.js";

// Get all articles with pagination, search, and filters
export const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'newest';
    const search = req.query.search || '';

    // Base pipeline stages
    const pipeline = [
      // Match non-deleted articles and search
      {
        $match: {
          deleted: { $ne: true },
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
          ]
        }
      },
      // Lookup user details
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      // Add computed fields
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
        }
      },
      // Project out unnecessary fields
      {
        $project: {
          authorDetails: 0,
          deleted: 0,
          __v: 0
        }
      }
    ];

    // Add sort stage based on sortBy
    switch (sortBy) {
      case 'oldest':
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      case 'title':
        pipeline.push({ $sort: { title: 1, createdAt: -1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Get total count for pagination
    const totalCount = await Article.aggregate([
      pipeline[0], // Only use the match stage for count
      { $count: 'total' }
    ]);

    // Add pagination stages
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    // Execute the main query
    const articles = await Article.aggregate(pipeline);

    // Calculate pagination metadata
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get single article with author details
export const getSingleArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          deleted: { $ne: true }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
        }
      },
      {
        $project: {
          authorDetails: 0,
          deleted: 0,
          __v: 0
        }
      }
    ]);

    if (!article.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Article not found" });
    }
    
    res.status(StatusCodes.OK).json(article[0]);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Create article
export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    const article = new Article({
      title,
      content,
      author: req.user.userId,
    });
    const savedArticle = await article.save();
    
    // Add article to user's articles array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { articles: savedArticle._id } }
    );

    res.status(StatusCodes.CREATED).json(savedArticle);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Article not found" });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user.userId.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to update this article" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    ).populate('author', 'name avatar _id');

    res.status(StatusCodes.OK).json(updatedArticle);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Delete article (soft delete)
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Article not found" });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user.userId.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized to delete this article" });
    }

    await Article.findByIdAndUpdate(id, { deleted: true });
    
    // Remove article from user's articles array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { articles: id } }
    );

    res.status(StatusCodes.OK).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Get articles by user ID with pagination
export const getArticlesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'newest';

    // Base pipeline stages
    const pipeline = [
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          deleted: { $ne: true }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
        }
      },
      {
        $project: {
          authorDetails: 0,
          deleted: 0,
          __v: 0
        }
      }
    ];

    // Add sort stage
    switch (sortBy) {
      case 'oldest':
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Get total count
    const totalCount = await Article.aggregate([
      pipeline[0],
      { $count: 'total' }
    ]);

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    const articles = await Article.aggregate(pipeline);
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};