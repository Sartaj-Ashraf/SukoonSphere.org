import { Router } from "express";
const router = Router();

import {
  createPodcast,
  getAllPodcasts,
  getSinglePodcast,
} from "../controllers/podcastsController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadPodcastFiles } from "../middleware/podcastUploadMiddleware.js";

// Create a new podcast
router.post(
  "/",
  authenticateUser,
  uploadPodcastFiles,
  createPodcast
);

// Get all podcasts
router.get("/", getAllPodcasts);

// Get single podcast by ID
router.get("/:id", getSinglePodcast);

export default router;