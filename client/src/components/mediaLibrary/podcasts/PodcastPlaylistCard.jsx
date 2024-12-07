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
      toast.success('Episode deleted successfully');
      if (fetchData) await fetchData();
    } catch (error) {
      console.error('Error deleting episode:', error);
      toast.error(error?.response?.data?.msg || 'Failed to delete episode');
    } finally {
      setShowDeleteModal(false);
      setSelectedEpisode(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-full mb-4">
      <div className="flex">
        {/* Left side - Image */}
        <div className="relative group w-64 min-w-[256px]">
          <img
            src={playlist.imageUrl}
            alt={playlist.title}
            className="w-full h-full object-cover min-h-[200px]"
          />
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {playlist.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {playlist.episodes.length}{" "}
                {playlist.episodes.length === 1 ? "Episode" : "Episodes"}
              </p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {playlist.description}
              </p>
            </div>

            {isContributor && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <FaEllipsisV />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                    <button
                      onClick={() => {
                        setShowAddEpisodeModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add Episode
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Episode List */}
          <div className="space-y-3 w-full">
            {playlist?.episodes?.length > 0 && <h4 className="font-medium text-gray-900 mb-2">Recent Episodes</h4>}
            {playlist?.episodes?.map((episode, index) => (
              <div
                key={episode._id}
                className="flex items-center justify-between w-full gap-3 text-sm bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="">
                    <p className="font-medium text-gray-900">{episode.title}</p>
                    <p className="text-gray-600">episode no{episode.episodeNo}</p>
                  </div>
                </div>
                {isContributor && (
                  <PostActions
                    handleEdit={() => handleEdit(episode)}
                    handleDelete={() => handleDelete(episode)}
                  />
                )}
              </div>
            ))}
          </div>
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
