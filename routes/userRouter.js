import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { profileMiddleware } from "../middleware/profileMiddleware.js";
import {
  changeUserProfile,
  followOrUnfollowUser,
  getAllFollowers,
  getAllFollowing,
  getUserDetailsById,
  getUserProfile,
  requestContributor,
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
router.get("/followers/:id",  getAllFollowers);
router.get("/following/:id",  getAllFollowing);
router.get("/profile", profileMiddleware, getUserProfile);
router.get("/user-details/:id", getUserDetailsById);
router.patch("/request-to-contribute",authenticateUser, requestContributor)
export default router;
