import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import Podcast from "../models/podcasts/podcastsModel.js";
import PodcastPlaylist from "../models/podcasts/podcastsModel.js";
import User from "../models/userModel.js";

export const getAllPodcasts = async (req, res) => {
    const podcast = await PodcastPlaylist.find({ type: "single" });
    if (!podcast) {
      throw new BadRequestError("Podcast not found");
    }
    res.status(StatusCodes.OK).json({ podcast });    
  };

  export const getSinglePodcast = async (req, res) => {
    const { id: podcastId } = req.params;
    const podcast = await PodcastPlaylist.findOne({ _id: podcastId });
    if (!podcast) {
      throw new BadRequestError("Podcast not found");
    }
    res.status(StatusCodes.OK).json({ podcast });
  };

  export const createPodcast = async (req, res) => {
    const { title, description, episodeNo } = req.body;
    
    if (!req.files || !req.files.image || !req.files.audio) {
      throw new BadRequestError('Please provide both image and audio files');
    }

    const newPodcast = {
      title,
      description,
      episodeNo,
      userId: req.user.userId,
    };

    // Handle image file
    if (!req.file) {
      throw new BadRequestError('Please provide podcast image and audio files');
    }

    const imageUrl = `${process.env.BACKEND_URL}/public/podcasts/images/${req.files.image[0].filename}`;
    const audioUrl = `${process.env.BACKEND_URL}/public/podcasts/episodes/${req.files.audio[0].filename}`;
    
    newPodcast.imageUrl = imageUrl;
    newPodcast.audioUrl = audioUrl;

    const podcast = await Podcast.create(newPodcast);
    
    // Add podcast reference to user's podcasts array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { podcasts: podcast._id } },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Podcast created successfully",
      podcast
    });
  };