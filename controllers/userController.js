import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multer.js";

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
  const user = await User.findById(req.user.userId);
  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    user.avatar = response.secure_url;
    user.avatarPublicId = response.public_id;
  }
  user.name = req.body.name;
  await user.save();
  res.status(StatusCodes.OK).json(user);
};

export const followOrUnfollowUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(req.user.userId);
  const userToFollow = await User.findById(userId);

  if (user.following.includes(userId)) {
    user.following.pull(userId);
    userToFollow.followers.pull(user._id);
  } else {
    user.following.push(userId);
    userToFollow.followers.push(user._id);
  }

  await Promise.all([user.save(), userToFollow.save()]);
  res.status(StatusCodes.OK).json(user);
};

export const getAllFollowers = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findById(userId);
  const followers = await User.find(
    { _id: { $in: user.followers } },
    "name email avatar followers following"
  );
  const followersWithCounts = followers.map((follower) => ({
    name: follower.name,
    email: follower.email,
    avatar: follower.avatar,
    totalFollowers: follower.followers.length,
    totalFollowing: follower.following.length,
  }));
  res.status(StatusCodes.OK).json({ followers: followersWithCounts });
};

export const getAllFollowing = async (req, res) => {
      const { id: userId } = req.params;
  const user = await User.findById(userId);
  const following = await User.find({ _id: { $in: user.following } });
  const followingWithCounts = following.map((following) => ({
    name: following.name,
    email: following.email,
    avatar: following.avatar,
    totalFollowers: following.followers.length,
    totalFollowing: following.following.length,
  }));
  res.status(StatusCodes.OK).json({ following: followingWithCounts });
};
