import React from 'react';
import { format } from 'date-fns';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const { coverImage, title, description, createdAt, _id } = video;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Video Cover Section */}
      <div className="relative ">
        <img
          src={coverImage}
          alt={title}
          className="w-full  h-40 md:h-64 object-cover transition-transform duration-300 hover:scale-105  "
        />
        {/* Play Button */}
        <Link
          to={`/all-videos/video/${_id}`}
          className="absolute  -bottom-6 right-4 bg-white p-4 rounded-full border-2 hover:border-2 hover:border-[var(--primary)] shadow-md transition-all duration-200 hover:-translate-y-1 hover:scale-110"
        >
          <FaPlay className="text-[var(--primary))] text-sm " />
        </Link>
      </div>

      {/* Video Details Section */}
      <div className="p-4">
        <Link to={`/all-videos/video/${_id}`} className="block">
          <h3 className="text-lg font-bold line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-500 text-sm">Created on: {format(new Date(createdAt), 'MMM dd, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;