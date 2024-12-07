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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="relative h-64 md:h-80">
            <img
              src={playlist.imageUrl || '/default-playlist-image.jpg'}
              alt={playlist.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
              <div className="absolute bottom-8 left-8 text-white">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">{playlist.title}</h1>
                <div className="flex items-center space-x-4 text-gray-200">
                  <div className="flex items-center">
                    <FaHeadphones className="mr-2" />
                    <span className="text-sm font-medium">{playlist.userId?.name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <FaPlay className="mr-2" />
                    <span className="text-sm font-medium">{playlist.episodes?.length || 0} Episodes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
         

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed">{playlist.description}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="border-b-2 border-indigo-600 pb-1">Episodes</span>
              </h2>
              <div className="space-y-6">
                <PodcastsGrid podcasts={playlist.episodes} isPlayList={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
