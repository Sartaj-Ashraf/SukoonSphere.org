import React from 'react';
import PodcastCard from './PodcastCard';

const PodcastsGrid = ({ podcasts, loading, error ,isPlayList }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {podcasts && podcasts.length > 0 ? (
        podcasts.map((podcast) => (
          <PodcastCard key={podcast._id} podcast={podcast} isPlayList={isPlayList} />
        ))
      ) : (
        <div className="text-center text-gray-500 col-span-full py-12">
          <p className="text-xl">No podcasts found</p>
          <p className="text-sm mt-2">Check back later for new content</p>
        </div>
      )}
    </div>
  );
};

export default PodcastsGrid;
