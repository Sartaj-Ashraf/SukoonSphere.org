    import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../errors/customErors.js";
import Podcast from "../models/podcasts/podcastsModel.js";
import { PodcastPlaylist } from "../models/podcasts/podcastsModel.js";
import User from "../models/userModel.js";
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export const getAllPodcasts = async (req, res) => {
    const podcasts = await Podcast.find({})
      .populate({
        path: 'episodes',
        select: 'title description imageUrl audioUrl episodeNo'
      });
    res.status(StatusCodes.OK).json({ podcasts });    
};

export const getAllSinglePodcasts = async (req, res) => {
    try {
        // Get all podcasts with type 'single'
        const singlePodcasts = await Podcast.find({ type: 'single' })
            .populate('userId', 'name profileImage')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(StatusCodes.OK).json({ 
            podcasts: singlePodcasts,
            count: singlePodcasts.length
        });
    } catch (error) {
        console.error('Error fetching single podcasts:', error);
        throw new BadRequestError("Error fetching single podcasts");
    }
};

export const getSinglePodcast = async (req, res) => {
    const { id: podcastId } = req.params;
    const podcast = await Podcast.findOne({ _id: podcastId });
    if (!podcast) {
      throw new BadRequestError("Podcast not found");
    }
    res.status(StatusCodes.OK).json({ podcast });
};

export const getPlaylistPodcast = async (req, res) => {
    try {
        const { id: podcastId } = req.params;
        
        // Find playlist and populate episodes with all necessary fields
        const playlist = await PodcastPlaylist.findOne({ _id: podcastId })
            .populate({
                path: 'episodes',
                select: 'title description imageUrl audioUrl episodeNo duration createdAt'
            });

        if (!playlist) {
            throw new NotFoundError("Podcast playlist not found");
        }

        res.status(StatusCodes.OK).json({ 
            playlist,
            episodesCount: playlist.episodes.length
        });
    } catch (error) {
        console.error('Error fetching playlist:', error);
        throw new BadRequestError(error.message || "Error fetching playlist");
    }
};

export const getAllPlaylistPodcasts = async (req, res) => {
    try {
        // Get all playlists with populated episodes
        const playlists = await PodcastPlaylist.find({})
            .populate({
                path: 'episodes',
                select: 'title description imageUrl audioUrl episodeNo'
            });

        // Return the playlists with their populated episodes
        res.status(StatusCodes.OK).json({ 
            playlists,
            count: playlists.length
        });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        throw new BadRequestError("Error fetching playlists");
    }
};

export const getUserSinglePodcasts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all single podcasts for specific user
        const userSinglePodcasts = await Podcast.find({ 
            userId: userId,
            type: 'single' 
        })
        .populate('userId', 'name profileImage')
        .sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json({ 
            podcasts: userSinglePodcasts,
            count: userSinglePodcasts.length
        });
    } catch (error) {
        console.error('Error fetching user single podcasts:', error);
        throw new BadRequestError("Error fetching user single podcasts");
    }
};

export const getUserPlaylistPodcasts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all playlists for specific user with populated episodes
        const userPlaylists = await PodcastPlaylist.find({ userId: userId })
            .populate({
                path: 'episodes',
                select: 'title description imageUrl audioUrl episodeNo'
            })
            .sort({ createdAt: -1 });

        res.status(StatusCodes.OK).json({ 
            playlists: userPlaylists,
            count: userPlaylists.length
        });
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        throw new BadRequestError("Error fetching user playlists");
    }
};

export const createPodcast = async (req, res) => {
    const { title, description, episodeNo, type = 'single', playlistId } = req.body;
    
    if (!req.files || !req.files.image || !req.files.audio) {
      throw new BadRequestError('Please provide both image and audio files');
    }
  
    const newPodcast = {
      title,
      description,
      episodeNo,
      userId: req.user.userId,
      type
    };
  
    // Handle files
    const imageFile = req.files.image[0];
    const audioFile = req.files.audio[0];
    
    newPodcast.imageUrl = `${process.env.BACKEND_URL}/public/podcasts/images/${imageFile.filename}`;
    newPodcast.audioUrl = `${process.env.BACKEND_URL}/public/podcasts/episodes/${audioFile.filename}`;
  
    const podcast = await Podcast.create(newPodcast);

    // If this is a playlist episode, add it to the playlist
    if (type === 'playlist' && playlistId) {
      const playlist = await PodcastPlaylist.findById(playlistId);
      if (!playlist) {
        throw new BadRequestError('Playlist not found');
      }
      
      // Check if user owns the playlist
      if (playlist.userId.toString() !== req.user.userId) {
        throw new UnauthorizedError('Not authorized to modify this playlist');
      }

      // Add episode to playlist
      playlist.episodes.push(podcast._id);
      await playlist.save();
    }
    
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

export const createPodcastPlaylist = async (req, res) => {
    const { title, description } = req.body;
    
    if (!req.files || !req.files.image) {
      throw new BadRequestError('Please provide a cover image for the playlist');
    }
  
    const newPlaylist = {
      title,
      description,
      userId: req.user.userId,
      episodes: [], // Initially empty array of episodes
    };
  
    // Handle image file
    const imageFile = req.files.image[0];
    newPlaylist.imageUrl = `${process.env.BACKEND_URL}/public/podcasts/images/${imageFile.filename}`;
  
    const playlist = await PodcastPlaylist.create(newPlaylist);
    
  
    res.status(StatusCodes.CREATED).json({
      msg: "Podcast playlist created successfully",
      playlist
    });
};

export const deletePodcast = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the podcast to get file paths before deletion
        const podcast = await Podcast.findById(id);
        if (!podcast) {
            throw new NotFoundError('Podcast not found');
        }

        // Check if user is authorized to delete
        if (podcast.userId.toString() !== req.user.userId) {
            throw new UnauthorizedError('Not authorized to delete this podcast');
        }

        // Delete files from public directory
        const deleteFile = async (fileUrl) => {
            if (!fileUrl) return;
            try {
                // Extract the path after /public/ from the full URL
                const urlPath = fileUrl.split('/public/')[1];
                if (!urlPath) {
                    console.log(`Invalid file path: ${fileUrl}`);
                    return;
                }

                const fullPath = path.join(process.cwd(), 'public', urlPath);
                
                // Check if file exists before attempting deletion
                if (fs.existsSync(fullPath)) {
                    await unlinkAsync(fullPath);
                    console.log(`Successfully deleted file: ${fullPath}`);
                } else {
                    console.log(`File not found: ${fullPath}`);
                }
            } catch (error) {
                console.error(`Error deleting file ${fileUrl}:`, error);
                throw new Error(`Failed to delete file: ${error.message}`);
            }
        };

        // Delete image and audio files
        await Promise.all([
            deleteFile(podcast.imageUrl),
            deleteFile(podcast.audioUrl)
        ]);

        // If it's a single podcast, just delete it
        if (podcast.type === 'single') {
            await Podcast.findByIdAndDelete(id);
        } else {
            // If it's part of a playlist, remove it from the playlist first
            if (podcast.playlistId) {
                await PodcastPlaylist.findByIdAndUpdate(
                    podcast.playlistId,
                    { $pull: { episodes: podcast._id } }
                );
            }
            await Podcast.findByIdAndDelete(id);
        }

        res.status(StatusCodes.OK).json({ 
            message: 'Podcast and associated files deleted successfully',
            deletedPodcast: podcast
        });
    } catch (error) {
        console.error('Error deleting podcast:', error);
        throw new BadRequestError(error.message || 'Error deleting podcast');
    }
};

export const editPodcast = async (req, res) => {
    try {
        const { id: podcastId } = req.params;
        const { title, description } = req.body;
        
        // Find the podcast
        const podcast = await Podcast.findById(podcastId);
        
        if (!podcast) {
            throw new NotFoundError('Podcast not found');
        }

        // Check if the user is authorized to edit this podcast
        if (podcast.userId.toString() !== req.user.userId) {
            throw new UnauthorizedError('Not authorized to edit this podcast');
        }

        // Update the podcast fields
        const updatedFields = {
            title: title || podcast.title,
            description: description || podcast.description
        };

        // Handle image update if new image is uploaded
        if (req.files && req.files.image) {
            // Delete old image if it exists
            if (podcast.imageUrl) {
                const oldImagePath = path.join(process.cwd(), podcast.imageUrl);
                try {
                    await unlinkAsync(oldImagePath);
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }

            const imageFile = req.files.image;
            const imageFileName = `${Date.now()}-${imageFile.name}`;
            const imagePath = path.join('uploads', 'podcasts', 'images', imageFileName);
            
            // Ensure directory exists
            const imageDir = path.join(process.cwd(), 'uploads', 'podcasts', 'images');
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
            }

            // Move the new image
            await imageFile.mv(path.join(process.cwd(), imagePath));
            updatedFields.imageUrl = imagePath;
        }

        // Update the podcast
        const updatedPodcast = await Podcast.findByIdAndUpdate(
            podcastId,
            updatedFields,
            { new: true, runValidators: true }
        );

        res.status(StatusCodes.OK).json({ 
            message: 'Podcast updated successfully',
            podcast: updatedPodcast 
        });
    } catch (error) {
        console.error('Error updating podcast:', error);
        throw new BadRequestError(error.message || 'Error updating podcast');
    }
};
