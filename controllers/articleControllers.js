import ArticleModel from "../models/articles/articleModel.js";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import { StatusCodes } from "http-status-codes";
import PageModel from "../models/articles/articlePageModel.js";
import UserModel from "../models/userModel.js";
import fs from "fs";
import path from "path";

// import { formatImage } from "../middleware/multer.js";
// import cloudinary from "cloudinary";

export const createArticle = async (req, res) => {
  const { userId, role } = req.user;
  const { title, coverPage } = req.body;
  if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to create an article");
  }
  const article = await ArticleModel.create({
    title,
    coverPage,
    author: userId,
  });
  res.status(StatusCodes.CREATED).json({ article });
};
// export const uploadImage = async (req, res) => {
//   if (req.file) {
//     const file = formatImage(req.file);
//     try {
//       const response = await cloudinary.v2.uploader.upload(file);
//       res.status(StatusCodes.CREATED).json({ imageUrl: response.secure_url });
//     } catch (error) {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
//     }
//   }
//   res.status(StatusCodes.BAD_REQUEST).json({ error: "No file uploaded" });
// };
export const createPdfArticle = async (req, res) => {
   const { userId, role } = req.user;
   const { title,} = req.body;
   if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to create an article");
   }
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "No file uploaded" });
  }
  try {
    // Construct the PDF file URL
    const fileUrl = `${process.env.BACKEND_URL}/public/articles/${req.file.filename}`;

    // Respond with the PDF file URL
    const article = await ArticleModel.create({ 
      title,
      pdfPath: fileUrl,
      author: userId,
    });
    res.status(StatusCodes.CREATED).json({ article });
  } catch (error) {
    console.error("Error creating article:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error creating article" });
  }
};

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "No file uploaded" });
  }

  try {
    const fileUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`; // File path relative to `public`
    res.status(StatusCodes.CREATED).json({ imageUrl: fileUrl });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error saving file" });
  }
};

    export const deleteImage = async (req, res) => {
      const { id: filename } = req.body;

      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadsDir, filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "Image not found" });
        }

        // Delete the file
        fs.unlinkSync(filePath);

        res.status(StatusCodes.OK).json({ message: "Image deleted successfully" });
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Error deleting image" });
      }
    };

export const getPendingArticles = async (req, res) => {
  const { userId, role } = req.user;
  if (role !== "contributor") {
    throw new UnauthorizedError(
      "You are not authorized to get pending articles"
    );
  }
  const articles = await ArticleModel.find({
    status: "pending",
    author: userId,
  });

  // Get pages for each article
  const articlesWithPages = await Promise.all(
    articles.map(async (article) => {
      const pages = await PageModel.find({ pageOf: article._id });
      return { ...article._doc, pages };
    })
  );

  res.status(StatusCodes.OK).json({ articles: articlesWithPages });
};
export const publishArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const { role } = req.user;
  if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to publish an article");
  }
  const article = await ArticleModel.findByIdAndUpdate(articleId, {
    status: "published",
  });
  res.status(StatusCodes.OK).json({ article });
};

export const getPublishedArticles = async (req, res) => {
  const articles = await ArticleModel.find({ status: "published" });
  const articlesWithAuthorAndPages = await Promise.all(
    articles.map(async (article) => {
      const author = await UserModel.findById(
        article.author,
        "name avatar _id "
      );
      const pages = await PageModel.find({ pageOf: article._id });
      return { ...article._doc, author, pages };
    })
  );
  res.status(StatusCodes.OK).json({ articles: articlesWithAuthorAndPages });
};

export const createArticlePage = async (req, res) => {
  const { id: articleId } = req.params;
  const { title, content, pageNumber } = req.body;
  const article = await ArticleModel.findById(articleId);
  if (!article) {
    throw new BadRequestError("Article not found");
  }

  // Find existing pages for this article and get max page number
  const existingPage = await PageModel.findOne({
    pageOf: articleId,
    pageNumber,
  });
  if (existingPage) {
    throw new BadRequestError("Page already exists");
  }
  const page = await PageModel.create({
    title,
    pageContent: content,
    pageOf: articleId,
    pageNumber,
  });
  await ArticleModel.findByIdAndUpdate(articleId, {
    $push: { pages: page._id },
  });
  res.status(StatusCodes.CREATED).json({ page });
};
export const deleteArticlePage = async (req, res) => {
  const { id: pageId } = req.params;
  const { userId, role } = req.user;
  if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to delete a page");
  }
  const page = await PageModel.findByIdAndDelete(pageId);
  if (!page) {
    throw new BadRequestError("Page not found");
  }
  await ArticleModel.findByIdAndUpdate(page.pageOf, {
    $pull: { pages: pageId },
  });
  res.status(StatusCodes.OK).json({ page });
};
export const editArticlePage = async (req, res) => {
  const { id: pageId } = req.params;
  const { role } = req.user;
  if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to edit a page");
  }
  const { title, content, pageNumber } = req.body;
  const page = await PageModel.findByIdAndUpdate(pageId);
  if (!page) {
    throw new BadRequestError("Page not found");
  }

  // Check if another page with same number exists
  const existingPage = await PageModel.findOne({
    pageOf: page.pageOf,
    pageNumber,
    _id: { $ne: pageId },
  });
  if (existingPage) {
    throw new BadRequestError("Page number already exists");
  }

  const updatedPage = await PageModel.findByIdAndUpdate(
    pageId,
    {
      title,
      pageContent: content,
      pageNumber,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ page: updatedPage });
};
export const getArticlePage = async (req, res) => {
  const { id: pageId } = req.params;
  const page = await PageModel.findById(pageId);
  if (!page) {
    throw new BadRequestError("Page not found");
  }
  res.status(StatusCodes.OK).json({ page });
};
export const getArticleCoverPage = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await ArticleModel.findById(articleId);
  if (!article) {
    throw new BadRequestError("Article not found");
  }
  res.status(StatusCodes.OK).json({ coverPage: article });
};
export const deleteArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const { role } = req.user;
  if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to delete an article");
  }
  const article = await ArticleModel.findByIdAndDelete(articleId);
  res.status(StatusCodes.OK).json({ article });
};
export const editArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const { role } = req.user;
  if (role !== "contributor") {
    throw new UnauthorizedError("You are not authorized to edit an article");
  }
  const { title, coverPage } = req.body;
  const article = await ArticleModel.findByIdAndUpdate(articleId, {
    title,
    coverPage,
  });
  res.status(StatusCodes.OK).json({ article });
};

export const getArticleWithPages = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await ArticleModel.findById(articleId);
  if (!article) {
    throw new BadRequestError("Article not found");
  }
  const pages = await PageModel.find({ pageOf: articleId });
  res.status(StatusCodes.OK).json({ article: { ...article._doc, pages } });
};
