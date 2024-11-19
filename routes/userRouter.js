import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  changeUserProfile,
  followOrUnfollowUser,
  getAllFollowers,
  getAllFollowing,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
const router = Router();

router.patch(
  "/change-profile",
  authenticateUser,
  upload.single("avatar"),
  changeUserProfile
);
router.patch("/follow/:id", authenticateUser, followOrUnfollowUser);
router.get("/followers", authenticateUser, getAllFollowers);
router.get("/following", authenticateUser, getAllFollowing);
export default router;
