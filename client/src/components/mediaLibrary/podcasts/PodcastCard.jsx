import React from "react";
import { FaDownload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./audio.css";

const PodcastCard = ({ podcast, isPlayList }) => {
  const navigate = useNavigate();

  return (
    <Link
      to={`/podcasts/episode/${podcast._id}`}
      key={podcast._id}
      style={{
        backgroundImage: `url(${podcast.imageUrl || "/default-podcast-image.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

      }}
      className="relative text-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Overlay for additional styling */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden "></div>

      <div className="relative group w-40 h-40 my-10 mx-auto shadow-2xl bg-white rounded-lg overflow-hidden">
        <img
          src={podcast.imageUrl || "/default-podcast-image.jpg"}
          alt={podcast.title}
          className="absolute z-20 top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 relative ">
        <h2 className="text-xl font-bold mb-2 text-white line-clamp-1">
          {podcast.title}
        </h2>

        {isPlayList && <span>episode no {podcast.episodeNo}</span>}
        <p className="text-white mb-4 line-clamp-2 text-sm">
          {podcast.description || "No description available"}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <audio
              controls
              src={podcast.audioUrl}
              className=" h-8 bg-white rounded-full shadow-sm focus:outline-none audio-player"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
          <div>
            <button
              onClick={() => {
                // Add functionality to download the podcast
                window.location.href = podcast.audioUrl;
              }}
              className="backdrop-blur-md  bg-white/40 p-2 rounded-full shadow-sm"
            >
              <FaDownload className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;