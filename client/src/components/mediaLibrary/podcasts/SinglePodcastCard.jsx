import PostActions from "@/components/shared/PostActions";
import DeleteModal from "@/components/shared/DeleteModal";
import React, { useState, useRef } from "react";
import { FaPlay, FaPause, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const SinglePodcastCard = ({ podcast, fetchData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return "0:00";
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition =
      (e.pageX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit podcast:", podcast._id);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const deletePodcast = async () => {
    try {
      await customFetch.delete(`/podcasts/${podcast._id}`);
      toast.success("Podcast deleted successfully");
      await fetchData();
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete podcast");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg  overflow-hidden hover:shadow-lg transition-shadow w-full mb-4">
      <div className="flex bg-white rounded-xl  mx-auto transition-all duration-300">
        {/* Left side - Image */}
        <div className="w-64 flex-shrink-0">
          <img
            src={podcast.imageUrl}
            alt={podcast.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {podcast.title}
              </h3>

              {/* Creator Info */}
              <div className="flex items-center space-x-2 mb-3">
                {podcast.userId?.profileImage ? (
                  <img
                    src={podcast.userId.profileImage}
                    alt={podcast.userId.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {podcast.userId?.name || "Anonymous"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {podcast.description}
              </p>
            </div>
            <PostActions
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
           
          </div>

          {/* Audio Progress Bar */}
          <button
              onClick={togglePlay}
              className="bg-[var(--primary)] text-white p-3 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {isPlaying ? (
                <FaPause className="w-5 h-5" />
              ) : (
                <FaPlay className="w-5 h-5" />
              )}
            </button>
          <div className="space-y-2 ">
            <div
              className="h-1.5 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="absolute h-full bg-blue-500 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Episode Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {podcast.episodeNo && (
              <span className="bg-gray-100 px-2 py-1 rounded-md">
                Episode {podcast.episodeNo}
              </span>
            )}
            {podcast.duration && (
              <span className="bg-gray-100 px-2 py-1 rounded-md">
                {podcast.duration}
              </span>
            )}
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={podcast.audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
        </div>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deletePodcast}
        title="Delete Podcast"
        message="Are you sure you want to delete this podcast? This action cannot be undone."
      />
    </div>
  );
};

export default SinglePodcastCard;
