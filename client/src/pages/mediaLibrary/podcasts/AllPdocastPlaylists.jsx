import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customFetch from '@/utils/customFetch';

const AllPodcastPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await customFetch.get('/podcasts/playlists');
        console.log({response});
        setPlaylists(response.data.playlists || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);
  
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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Podcast Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {playlists && playlists.length > 0 ? playlists.map((playlist) => (
          <div 
            key={playlist._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/podcasts/playlist/${playlist._id}`)}
          >
            <div className="relative pb-[60%] group">
              <img
                src={playlist.imageUrl || '/default-playlist-image.jpg'}
                alt={playlist.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                    {playlist.episodes?.length || 0} Episodes
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm font-medium text-blue-600">
                  {playlist.userId?.name}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">
                  {new Date(playlist.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-1">
                {playlist.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                {playlist.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Last updated: {' '}
                  {new Date(playlist.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <Link to={`/podcasts/playlist/${playlist._id}`} className="text-blue-500 hover:text-blue-600">
                  View Playlist →
                </Link>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 col-span-full py-12">
            <p className="text-xl">No playlists found</p>
            <p className="text-sm mt-2">Create a playlist to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPodcastPlaylists;