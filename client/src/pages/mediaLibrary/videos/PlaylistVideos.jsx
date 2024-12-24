import VideoCard from "@/components/mediaLibrary/videos/VideoCard";
import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { FaFilm, FaPlusCircle } from "react-icons/fa";

const PlaylistVideos = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center itms-center text-center text-gray-500 ">
           <div className="bg-blue-100 p-6 rounded-full">
            <FaFilm className="w-16 h-16 text-blue-600 animate-pulse" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
              Empty Playlist
            </h2>
            <p className="text-[var(--grey--800)] mb-6">
              No playlist found. This collection is currently empty.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistVideos;
