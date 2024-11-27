import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { profileMiddleware } from "../middleware/profileMiddleware.js";
import {
  AcceptContributorsRequest,
  changeUserProfile,
  deleteContributorsRequest,
  followOrUnfollowUser,
  getAllContributorsRequests,
  getAllFollowers,
  getAllFollowing,
  getUserDetailsById,
  getUserProfile,
  requestContributor,
  verifyContributor
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
// Contributor request management routes

router.patch("/verify-contributor/:id", authenticateUser, verifyContributor);
router.post("/request-contributor", authenticateUser, requestContributor);
router.get("/contributor-requests", authenticateUser, getAllContributorsRequests);
router.delete("/contributor-request/:id", authenticateUser, deleteContributorsRequest);
router.patch("/accept-contributor/:id", authenticateUser, AcceptContributorsRequest);

export default router;
