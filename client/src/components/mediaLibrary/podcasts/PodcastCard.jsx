import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PodcastCard = ({ podcast, isPlayList }) => {
  const navigate = useNavigate();

  return (
    <Link
    to={`/podcasts/episode/${podcast._id}`} 
      key={podcast._id}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative pb-[60%] group">
        <img
          src={podcast.imageUrl || '/default-podcast-image.jpg'}
          alt={podcast.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-1">
          {podcast.title}
        </h2>
        
        {isPlayList && <span>episode no {podcast.episodeNo}</span>}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {podcast.description  || 'No description available'}
        </p>
        <div className="space-y-3">
          <audio
            controls
            src={podcast.audioUrl}
            className="w-full focus:outline-none"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
