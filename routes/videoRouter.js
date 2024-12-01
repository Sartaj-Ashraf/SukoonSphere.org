import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

import { getUserVideos,
    getSingleVideo,
    deleteVideo,
    updateVideo,
    createVideo,
    getAllVideos }
     from "../controllers/videoController.js";

const router = Router();

router.post("/create-video", authenticateUser, createVideo);
router.get("/user-videos", authenticateUser, getUserVideos);
router.get("/video/:id", getSingleVideo);
router.patch("/update-video/:id", authenticateUser, updateVideo);
router.delete("/delete-video/:id", authenticateUser, deleteVideo);
router.get("/all-videos", getAllVideos);

export default router;
