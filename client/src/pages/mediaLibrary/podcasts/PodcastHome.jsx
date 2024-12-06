import React from 'react';
import { Outlet } from 'react-router-dom';

const PodcastHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full min-h-[60vh] bg-gradient-to-br from-[#1e3d5c] to-[#17495d] flex items-center justify-center py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-white relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-wide">
              Discover Amazing Podcasts
            </h1>
            <p className="text-lg md:text-xl font-normal max-w-3xl mx-auto opacity-90 leading-relaxed">
              Explore thought-provoking conversations about gender, society, and change
              through our carefully curated podcast collections
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-10">
        <Outlet />
      </div>
    </div>
  );
};

export default PodcastHome;