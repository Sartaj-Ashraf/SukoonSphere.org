import { AiOutlineLike } from "react-icons/ai";
import { podcastsLists } from "@/utils/podcastsLists";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import notFoundBySearch from "../../assets/images/notFoundBySearch.jpg";
import { FaRegCirclePlay } from "react-icons/fa6";
import MusicPlayer from "./MusicPlayer";

const PodcastCard = () => {
  const { id: paramsId } = useParams();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isHovered, setIsHovered] = useState(null);

  const podcastList = {
    ...podcastsLists.find((podcast) => podcast.podcastListId === paramsId),
    podcasts: [
      {
        id: 1,
        title: "Understanding AI Ethics",
        author: "Dr. Emily Stone",
        image: "https://source.unsplash.com/random/400x400?ai",
        audioSrc: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
      },
      {
        id: 2,
        title: "The Future of Technology",
        author: "Dr. Emily Stone",
        image: "https://source.unsplash.com/random/400x400?technology",
        audioSrc: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
      },
      {
        id: 3,
        title: "Digital Privacy Matters",
        author: "Dr. Emily Stone",
        image: "https://source.unsplash.com/random/400x400?privacy",
        audioSrc: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
      }
    ]
  };

  const podcastDetails = podcastList;

  const handlePlayAudio = (podcast) => {
    setCurrentAudio(podcast.audioSrc);
    setCurrentPodcast(podcast);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 border-b pb-4">
          {podcastDetails.podcastTitle}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Episode */}
            <div className="bg-gradient-to-r from-[#0b3948] to-[#095680] rounded-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 shadow-xl">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <img
                  className="w-48 h-48 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10"
                  src={podcastDetails.poadcasteImg || "https://randomuser.me/api/portraits/women/1.jpg"}
                  alt="Featured Episode"
                />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-white"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="Host"
                    />
                    <span className="text-white/90 font-medium">Dr. Emily Stone</span>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {podcastDetails.podcastDiscription}
                  </p>
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Episodes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {podcastList.podcasts.length > 0 ? (
                  podcastList.podcasts.map((podcast) => (
                    <div 
                      key={podcast.id}
                      onMouseEnter={() => setIsHovered(podcast.id)}
                      onMouseLeave={() => setIsHovered(null)}
                      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => handlePlayAudio(podcast)}
                      >
                        <div className="flex gap-4">
                          <div className="relative">
                            <img
                              className="w-24 h-24 rounded-lg object-cover"
                              src={podcast.image}
                              alt={podcast.title}
                            />
                            <div className={`absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center transition-opacity duration-200 ${isHovered === podcast.id ? 'opacity-100' : 'opacity-0'}`}>
                              <FaRegCirclePlay className="text-white text-3xl" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                              {podcast.title}
                            </h3>
                            <p className="text-sm text-gray-600">{podcast.author}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                                Play Episode
                              </button>
                              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                <AiOutlineLike size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-600 mb-6">
                      No episodes found. Try adjusting your search criteria.
                    </p>
                    <img
                      src={notFoundBySearch}
                      alt="No podcasts found"
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-6">
              <MusicPlayer currentAudio={currentAudio} currentPodcast={currentPodcast}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;