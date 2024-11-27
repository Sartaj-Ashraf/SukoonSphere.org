import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";
import { deleteFile } from '../utils/fileUtils.js';
import RequestContribute from "../models/requestContribute/requestContributeModel.js";
import sendContributorKeyEmail from "../utils/sendContributorKeyEmail.js";

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "name email avatar _id role"
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
      isFollowing: follower.followers.includes(userId)
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
      isFollowing: followed.followers.includes(userId)
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
  const { key } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found." });
    }

    // Check if user is already a contributor
    if (user.role === "contributor") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "You are already a contributor." });
    }

    // Verify if the provided key matches user's contributor key
    if (!user.contributerKey || user.contributerKey !== key) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid contributor key. Please check your key and try again." });
    }

    // Update user role to contributor
    user.role = "contributor";
    user.contributerKey = null;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Congratulations! You are now a contributor." });
  } catch (error) {
    console.error('Error in requestContributor:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const verifyContributor = async (req, res) => {
  const { fullname, email, message } = req.body;
  const { userId } = req.user; 

  try {
    // Check if user already has any request in the system
    const existingRequest = await RequestContribute.findOne({ userId });

    if (existingRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        error: "You have already submitted a request. You cannot submit multiple requests." 
      });
    }

    // If no existing request, create a new one
    const request = {
      fullname,
      email,
      message,
      userId,
      status: 'pending'
    };
    
    const requestContribute = new RequestContribute(request);
    await requestContribute.save();
    
    res.status(StatusCodes.OK).json({ 
      msg: "Your request has been submitted successfully. We will review it and get back to you soon." 
    });
    
  } catch (error) {
    console.error('Error in verifyContributor:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

export const getAllContributorsRequests = async (req, res) => {
  if(req.user.role !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to perform this action." });
  }
  try {
    const requests = await RequestContribute.find();
    res.status(StatusCodes.OK).json({ requests });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
}
export const deleteContributorsRequest = async (req, res) => {
  const { id : requestId } = req.params;
  if(req.user.role !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to perform this action." });
  }
  try {
    await RequestContribute.findByIdAndDelete(requestId);
    res.status(StatusCodes.OK).json({ msg: "Request deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
}
export const AcceptContributorsRequest = async (req, res) => {
  const { id: requestId } = req.params;
  
  if (req.user.role !== "admin") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: "You are not authorized to perform this action." });
  }

  try {
    // Find the request by its _id
    const request = await RequestContribute.findById(requestId);
    if (!request) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Contributor request not found" });
    }

    // Generate contributor key
    const contributerKey = Math.floor(Math.random() * 1000000000).toString();

    // Update user with contributor key
    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { contributerKey },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    // Send email with contributor key
    await sendContributorKeyEmail({
      name: request.fullname,
      email: request.email,
      contributerKey
    });

    // Update request status to accepted
    request.status = 'accepted';
    await request.save();

    res.status(StatusCodes.OK).json({ 
      msg: "Request accepted successfully and email sent to contributor" 
    });

  } catch (error) {
    console.error('Error accepting contributor request:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong. Please try again later." });
  }
};