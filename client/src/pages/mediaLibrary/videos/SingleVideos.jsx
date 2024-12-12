import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import VideoCard from '../../../components/mediaLibrary/videos/VideoCard';
import { FaFilm, FaPlusCircle } from 'react-icons/fa';

const SingleVideos = () => {
  const { videos } = useLoaderData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videos) {
      setIsLoading(false);
    }
  }, [videos]);

  const hasVideos = videos && videos.length > 0;

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-color)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {hasVideos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] rounded-xl p-8 space-y-6 text-center">
          <div className="bg-blue-100 p-6 rounded-full">
            <FaFilm className="w-16 h-16 text-blue-600 animate-pulse" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
              No Videos Found
            </h2>
            <p className="text-[var(--grey--800)] mb-6">
              No videos found. This collection is currently empty.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleVideos;