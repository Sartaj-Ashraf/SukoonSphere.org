import React, { useState } from "react";
import { FaPlay, FaPlus, FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";
import CreateNewPodcast from "../../../pages/contributors/models/CreateNewPodcast";
import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const PodcastPlaylistCard = ({ playlist, isContributor, fetchData }) => {
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const handleDelete = (episode) => {
    setSelectedEpisode(episode);
    setShowDeleteModal(true);
  };

  const handleEdit = (episode) => {
    // Implement edit functionality
    console.log("Edit episode:", episode._id);
  };

  const deleteEpisode = async () => {
    try {
      await customFetch.delete(`/podcasts/${selectedEpisode._id}`);
      toast.success("Episode deleted successfully");
      if (fetchData) await fetchData();
    } catch (error) {
      console.error("Error deleting episode:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete episode");
    } finally {
      setShowDeleteModal(false);
      setSelectedEpisode(null);
    }
  };

  return (
    <div className=" bg-white rounded-lg shadow-md   transition-shadow w-full mb-4">
      <div className="flex  flex-col ">
        {/* Right side - Content */}
        <div className="flex flex-col md:flex-row p-4 md:p-6 bg-white border-l-4 border-blue-500 space-y-4 md:space-y-0 md:space-x-6">
          {/* Left side - Image */}
          <div className="flex-shrink-0 self-start md:self-center w-full md:w-fit">
            <div className="relative group w-full md:w-64 h-48 md:h-[200px] overflow-hidden rounded-lg border border-gray-100 transition-all duration-300">
              <img
                src={playlist.imageUrl}
                alt={playlist.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-between w-full">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {playlist.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {playlist.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {playlist.episodes.length}{" "}
                    {playlist.episodes.length <= 1 ? "Total Episode" : "Total Episodes"}
                  </p>
                </div>

                {isContributor && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none"
                    >
                      <FaEllipsisV />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md z-10 py-1 animate-fade-in">
                        <button
                          onClick={() => {
                            setShowAddEpisodeModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-all duration-300"
                        >
                          <FaPlus className="w-4 h-4" />
                          Add Episode
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Episode List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
          {playlist?.episodes?.map((episode, index) => (
            <div
              key={episode._id}
              className="flex items-center justify-between bg-white border border-gray-100 py-2 px-4 rounded-lg hover:ring-2 hover:ring-gray-100 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 w-full">
                <span className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-gray-800 truncate max-w-full">
                    {episode.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Episode {episode.episodeNo}
                  </p>
                </div>
                {isContributor && (
                  <div className="flex-shrink-0 ">
                    <PostActions
                      handleEdit={() => handleEdit(episode)}
                      handleDelete={() => handleDelete(episode)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Episode Modal */}
      {showAddEpisodeModal && (
        <CreateNewPodcast
          setShowModal={setShowAddEpisodeModal}
          type="playlist"
          playlistId={playlist._id}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title="Delete Episode"
        message={`Are you sure you want to delete "${selectedEpisode?.title}"? This action cannot be undone.`}
        onDelete={deleteEpisode}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEpisode(null);
        }}
      />
    </div>
  );
};

export default PodcastPlaylistCard;
