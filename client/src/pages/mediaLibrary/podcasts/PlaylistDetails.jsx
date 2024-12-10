import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import customFetch from '@/utils/customFetch';
import PodcastsGrid from '@/components/mediaLibrary/podcasts/PodcastsGrid';
import { FaPlay, FaCalendarAlt, FaHeadphones, FaClock } from 'react-icons/fa';

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await customFetch.get(`/podcasts/playlists/${playlistId}`);
        console.log({response});
        setPlaylist(response.data.playlist);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

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

  if (!playlist) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* Hero Image Section */}
        <div className="relative h-64 md:h-96 group">
          <img
            src={playlist.imageUrl || '/default-playlist-image.jpg'}
            alt={playlist.title}
            className="absolute inset-0 w-full h-full object-cover 
              group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight 
                text-shadow-lg line-clamp-2">{playlist.title}</h1>
              <div className="flex flex-wrap items-center space-x-4 text-gray-200">
                <div className="flex items-center space-x-2">
                  <FaHeadphones className="text-indigo-300" />
                  <span className="text-sm font-medium">
                    {playlist.userId?.name || 'Unknown Creator'}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-2">
                  <FaPlay className="text-indigo-300" />
                  <span className="text-sm font-medium">
                    {playlist.episodes?.length || 0} Episodes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 md:p-10">
          {/* Description */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              {playlist.description || 'No description available'}
            </p>
          </div>
          
          {/* Episodes Section */}
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="relative">
                Episodes
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded"></span>
              </span>
            </h2>
            <div className="space-y-6">
              <PodcastsGrid 
                podcasts={playlist.episodes} 
                isPlayList={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PlaylistDetails;
