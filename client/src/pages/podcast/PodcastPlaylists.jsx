import React, { useState } from "react";
import { podcastsLists } from "@/utils/podcastsLists";
import { Link, useParams } from "react-router-dom";
import bg_podcast from "../../assets/images/illustration-new.svg";

function PodcastPlaylists() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Parallax Effect */}
      <div 
        className="relative h-[500px] flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 57, 72, 0.9), rgba(11, 57, 72, 0.9)), url(${bg_podcast})`
        }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in">
            Discover Amazing Podcasts
          </h1>
          <p className="text-xl md:text-2xl text-[#b6c2db] leading-relaxed animate-fade-in-delay">
            Explore thought-provoking conversations about gender, society, and change through our carefully curated podcast collections
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filter/Search Section */}
        <div className="mb-12 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-[#0b3948] text-white rounded-full hover:bg-[#095680] transition-colors">
              All Episodes
            </button>
            <button className="px-6 py-3 bg-white text-[#0b3948] rounded-full hover:bg-gray-100 transition-colors">
              Most Popular
            </button>
            <button className="px-6 py-3 bg-white text-[#0b3948] rounded-full hover:bg-gray-100 transition-colors">
              Recently Added
            </button>
          </div>
          <div className="relative">
            <input 
              type="search"
              placeholder="Search podcasts..."
              className="pl-12 pr-4 py-3 rounded-full w-full md:w-[300px] border focus:outline-none focus:ring-2 focus:ring-[#0b3948]"
            />
            <svg className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Podcasts Grid */}
        <div className="grid gap-8">
          {podcastsLists.map((podcast) => (
            <div 
              key={podcast.podcastListId}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredId(podcast.podcastListId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative overflow-hidden">
                  <img
                    className="w-full h-64 md:h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    src={podcast.poadcasteImg}
                    alt={podcast.podcastTitle}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="flex-1 p-8 bg-gradient-to-r from-[#0b3948] to-[#095680]">
                  <Link to={`/podcast/${podcast.podcastListId}`}>
                    <h3 className="text-3xl font-bold text-white mb-4 hover:text-[#b6c2db] transition-colors">
                      {podcast.podcastTitle}
                    </h3>
                  </Link>
                  
                  <p className="text-[#b6c2db] text-lg mb-6 line-clamp-3">
                    {podcast.podcastDiscription}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          className="w-12 h-12 rounded-full border-2 border-white"
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          alt="Dr. Emily Stone"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium">Dr. Emily Stone</span>
                        <span className="text-[#b6c2db] text-sm">Host</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 ml-auto">
                      <div className="flex flex-col items-center">
                        <span className="text-white font-bold">10</span>
                        <span className="text-[#b6c2db] text-sm">Episodes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-white font-bold">4.8</span>
                        <span className="text-[#b6c2db] text-sm">Rating</span>
                      </div>
                      <button className="bg-white hover:bg-gray-100 text-[#0b3948] font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Listen Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PodcastPlaylists;
