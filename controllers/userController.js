import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";
import { deleteFile } from '../utils/fileUtils.js';

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "name email avatar _id"
  );
  res.status(StatusCodes.OK).json(user);
};

export const getUserDetailsById = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId).select("-password");
  res.status(StatusCodes.OK).json(user);
};

export const changeUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (req.file) {
      // Delete old avatar file if it exists
      if (user.avatar) {
        const oldAvatarPath = user.avatar.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
        await deleteFile(oldAvatarPath);
      }
      
      // Set new avatar path
      const filepath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`; 
      user.avatar = filepath;
    }
    
    if (req.body.name) {
      user.name = req.body.name;
    }
    
    await user.save();
    res.status(StatusCodes.OK).json({ 
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    // If something goes wrong and we uploaded a file, clean it up
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    throw error;
  }
};

export const followOrUnfollowUser = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user.userId;

    // Prevent self-following
    if (targetUserId === currentUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        msg: "You cannot follow yourself" 
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        msg: "User not found" 
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(StatusCodes.OK).json({
      success: true,
      isFollowing: !isFollowing,
      followerCount: targetUser.followers.length,
      followingCount: targetUser.following.length
    });
  } catch (error) {
    console.error('Follow/Unfollow Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error processing follow/unfollow request"
    });
  }
};

export const getAllFollowers = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found"
      });
    }

    const followers = await User.find(
      { _id: { $in: user.followers } },
      "name email avatar followers following"
    );

    const followersWithCounts = followers.map((follower) => ({
      _id: follower._id,
      name: follower.name,
      email: follower.email,
      avatar: follower.avatar,
      totalFollowers: follower.followers.length,
      totalFollowing: follower.following.length,
      isFollowing: follower.followers.includes(req.user.userId)
    }));

    res.status(StatusCodes.OK).json({ 
      success: true,
      followers: followersWithCounts 
    });
  } catch (error) {
    console.error('Get Followers Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching followers"
    });
  }
};

export const getAllFollowing = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found"
      });
    }

    const following = await User.find(
      { _id: { $in: user.following } },
      "name email avatar followers following"
    );

    const followingWithCounts = following.map((followed) => ({
      _id: followed._id,
      name: followed.name,
      email: followed.email,
      avatar: followed.avatar,
      totalFollowers: followed.followers.length,
      totalFollowing: followed.following.length,
      isFollowing: followed.followers.includes(req.user.userId)
    }));

    res.status(StatusCodes.OK).json({ 
      success: true,
      following: followingWithCounts 
    });
  } catch (error) {
    console.error('Get Following Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching following users"
    });
  }
};

export const requestContributor = async (req, res) => {
  const { userId } = req.user; 
  const { secret } = req.body;

  try {
    if (secret !== process.env.REQUEST_CONTRIBUTER_SECRET) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid secret. Access denied." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found." });
    }

    if (user.role === "contributor") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "You are already a contributor." });
    }

    user.role = "contributor";
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "You are now a contributor." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};
