import React from 'react';
import { format } from 'date-fns';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const { coverImage, title, description, tags, createdAt, videoUrl } = video;
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative h-48">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
      <Link to={`/all-videos/video/${videoUrl}`}>
        <h3 className="text-xl font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] mb-2 line-clamp-2">
          {title}
        </h3>
        </Link>
        <p className="text-[var(--grey--800)] mb-3 line-clamp-2">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        <p className="text-sm text-[var(--grey--600)] mb-4">
          Created on: {format(new Date(createdAt), 'MMM dd, yyyy')}
        </p>
        <Link
          to={`/all-videos/video/${videoUrl}`}
          className="w-full btn-2"
        >
          <FaPlay className="text-sm mr-2" /> Watch Video
        </Link>
      </div>    
    </div>
  );
};

export default VideoCard;
