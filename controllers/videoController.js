import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/customErors.js";
import Video from "../models/videos/videoModel.js";


export const getAllVideos = async (req, res) => {
    const videos = await Video.find();
    res.status(StatusCodes.OK).json({ videos });
};     

export const createVideo = async (req, res) => {
    const { userId } = req.user;
    if (req.user.role !== "contributor") {
      throw new UnauthenticatedError("You are not authorized to create a video");    
    }
    
    const video = await Video.create({
      ...req.body,
      author: userId,
    });
    res.status(StatusCodes.CREATED).json({ video });
}

export const updateVideo = async (req, res) => {
    const { id: videoId } = req.params;
    const { userId, role } = req.user;
    const video = await Video.findOne({ _id: videoId });
    if (!video) {
      throw new BadRequestError("Video not found");
    }

    if (role !== "contributor" && video.author.toString() !== userId) {
      throw new UnauthenticatedError("You are not authorized to update this video");
    }

    const updatedVideo = await Video.findOneAndUpdate({ _id: videoId }, req.body, {
      new: true,
    });
    res.status(StatusCodes.OK).json({ video: updatedVideo });
};

export const deleteVideo = async (req, res) => {
    const { id: videoId } = req.params;
    const { userId, role } = req.user;
    const video = await Video.findOne({ _id: videoId });
    if (!video) {
      throw new BadRequestError("Video not found");
    }

    if (role !== "contributor" && video.user.toString() !== userId) {
      throw new UnauthenticatedError("You are not authorized to delete this video");
    }

    await Video.findOneAndDelete({ _id: videoId });
    res.status(StatusCodes.OK).json({ msg: "Video deleted successfully" });
}
export const getSingleVideo = async (req, res) => {
    const { id: videoId } = req.params;
    const video = await Video.findOne({ _id: videoId });
    if (!video) {
      throw new BadRequestError("Video not found");
    }
    res.status(StatusCodes.OK).json({ video });
}
export const getUserVideos = async (req, res) => {
    const { userId } = req.user;    
    const videos = await Video.find({ author: userId });
    res.status(StatusCodes.OK).json({ videos });
}

export const getSingleVideos = async (req, res) => {
  const video = await Video.find({ type: "single" });
  if (!video) {
    throw new BadRequestError("Video not found");
  }
  res.status(StatusCodes.OK).json({ video });
}   

export const getPlaylistVideos = async (req, res) => {
  const video = await Video.find({ type: "playlist" });
  if (!video) {
    throw new BadRequestError("Video not found");
  }
  res.status(StatusCodes.OK).json({ video });
}