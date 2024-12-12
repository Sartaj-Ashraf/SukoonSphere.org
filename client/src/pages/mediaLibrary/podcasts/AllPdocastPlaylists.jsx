import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import {
  FaPodcast,
  FaUser,
  FaCalendarAlt,
  FaPlay,
  FaChevronRight,
} from "react-icons/fa";

const AllPodcastPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await customFetch.get("/podcasts/playlists");
        console.log({ response });
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
    <div className="container mx-auto  py-2 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center gap-3">
        <FaPodcast className="text-[var(--primary)]" size={36} />
        Podcast Playlists
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-[var(--primary)] rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl  cursor-pointer"
              onClick={() => navigate(`/podcasts/playlist/${playlist._id}`)}
            >
              <div className="relative h-48 group rounded-xl m-4 ">
                <img
                  src={playlist.imageUrl || "/default-playlist-image.jpg"}
                  alt={playlist.title}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
                  <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                      {playlist.episodes?.length || 0} Episodes
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <FaUser className="text-[var(--white-color)]" size={16} />
                  <span className="text-sm font-medium text-blue-600">
                    {playlist.userId?.name}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <FaCalendarAlt className="text-gray-400" size={14} />
                  <span className="text-xs text-gray-400">
                    {new Date(playlist.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 text-white line-clamp-1">
                  {playlist.title}
                </h2>
                <p className="text-[--grey--500] mb-4 line-clamp-2 text-sm">
                  {playlist.description || "No description available"}
                </p>
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" size={14} />
                    <span>
                      Last updated:{" "}
                      {new Date(playlist.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <Link
                    to={`/podcasts/playlist/${playlist._id}`}
                    className="inline-flex items-center px-2 py-2 bg-blue-50 text-blue-700 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-800 hover:shadow-md "
                  >
                    <span className="mr-1 text-xs">View Playlist</span>
                    <FaChevronRight
                      size={16}
                      className="text-blue-600 group-hover:text-blue-800"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
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
