import { Router } from "express";
const router = Router();

import {
  createArticle,
  uploadImage,
  createArticlePage,
  getPendingArticles,
  getArticleWithPages,
  publishArticle,
  deleteArticle,
  editArticle,
  getArticleCoverPage,
  getArticlePage,
  deleteArticlePage,
  editArticlePage,
  getPublishedArticles,
  deleteImage,
  createPdfArticle,
  getPublishedArticlesByUser
} from "../controllers/articleControllers.js";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import uploadPDF from "../middleware/pdfMulter.js";

// to create article
router.post("/create-article", authenticateUser, createArticle);
// to get pending articles
router.get("/get-pending-articles", authenticateUser, getPendingArticles);
// to get published articles
router.get("/get-published-articles", getPublishedArticles);
// to get published articles by user
router.get("/get-published-articles-by-user", authenticateUser, getPublishedArticlesByUser);
// to upload image
router.post("/upload-image", upload.single("image"), uploadImage);
// to delete image
router.delete("/delete-image", deleteImage);
// to upload pdf
router.post(
  "/upload-pdf",
  uploadPDF.single("pdf"),
  authenticateUser,
  createPdfArticle
);
// to create article page
router.post("/create-article-page/:id", authenticateUser, createArticlePage);
// to get article with pages
router.get("/get-article-with-pages/:id", optionalAuthenticateUser, getArticleWithPages);
// to publish article
router.patch("/publish-article/:id", authenticateUser, publishArticle);
// to delete article
router.delete("/delete-article/:id", authenticateUser, deleteArticle);
// to edit article
router.patch("/edit-article/:id", authenticateUser, editArticle);
// to get article cover page
router.get("/get-article-cover-page/:id", getArticleCoverPage);
// to get article page
router.get("/get-article-page/:id", getArticlePage);
// to delete article page
router.delete("/delete-article-page/:id", authenticateUser, deleteArticlePage);
// to edit article page
router.patch("/edit-article-page/:id", authenticateUser, editArticlePage);
export default router;
