import express from "express";
import { 
  getAllArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  getSingleArticle,
  getArticlesByUserId 
} from "../controllers/articleControllers.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/user/:userId", getArticlesByUserId);
router.get("/:id", getSingleArticle);

// Protected routes
router.post("/", authenticateUser, createArticle);
router.put("/:id", authenticateUser, updateArticle);
router.delete("/:id", authenticateUser, deleteArticle);

export default router;