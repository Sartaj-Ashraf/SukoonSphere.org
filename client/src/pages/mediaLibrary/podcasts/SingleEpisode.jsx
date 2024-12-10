import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const SingleEpisode = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio player states
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await customFetch.get(`/podcasts/${episodeId}`);
        setEpisode(response.data.podcast);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [episodeId]);

  // Audio player functions
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!episode)
    return (
      <div className="text-gray-500 text-center py-8">Episode not found</div>
    );

  return (
    <div className="min-h-screen py-6 sm:py-12 ">
      <div className="w-full max-w-4xl mx-auto">
        {/* Episode Header */}
        <div
          className="
        bg-white 
        rounded-2xl 
        sm:rounded-3xl 
        shadow-xl 
        sm:shadow-2xl 
        overflow-hidden 
        mb-8 
        border-b-2 
        sm:border-b-4 
        border-indigo-500
      "
        >
          {/* Image Section with Enhanced Overlay */}
          <div className="relative h-48 sm:h-64 md:h-80 group overflow-hidden">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="
              w-full 
              h-full 
              object-cover 
              transition-transform 
              duration-300 
              group-hover:scale-105
            "
            />
            <div
              className="
            absolute 
            inset-0 
            bg-gradient-to-t 
            from-black/80 
            via-black/50 
            to-transparent 
            opacity-100 
            group-hover:opacity-90 
            transition-opacity 
            duration-300
          "
            >
              <div
                className="
              absolute 
              bottom-4 
              sm:bottom-8 
              left-4 
              sm:left-8 
              text-white 
              transform 
              transition-transform 
              duration-300 
              group-hover:translate-x-2
            "
              >
                <h1
                  className="
                text-2xl 
                sm:text-3xl 
                md:text-4xl 
                font-bold 
                mb-2 
                sm:mb-3 
                bg-clip-text 
                text-transparent 
                bg-gradient-to-r 
                from-white 
                to-gray-300
              "
                >
                  {episode.title}
                </h1>
                <div
                  className="
                flex 
                items-center 
                space-x-2 
                sm:space-x-4 
                text-gray-300 
                opacity-75 
                text-xs 
                sm:text-sm
              "
                >
                  <span>Episode {episode.episodeNo}</span>
                  <span>•</span>
                  <span>
                    {new Date(episode.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-8 bg-white">
            <p
              className="
            text-gray-700 
            leading-relaxed 
            mb-6 
            sm:mb-8 
            text-base 
            sm:text-lg 
            tracking-wide
          "
            >
              {episode.description}
            </p>

            {/* Audio Player with Enhanced Design */}
            <div
              className="
            bg-gradient-to-br 
            from-gray-50 
            to-gray-100 
            rounded-xl 
            sm:rounded-2xl 
            p-4 
            sm:p-6 
            shadow-md
          "
            >
              <audio
                ref={audioRef}
                src={episode.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
              />

              {/* Play/Pause and Progress */}
              <div
                className="
              flex 
              flex-col 
              sm:flex-row 
              items-center 
              space-y-4 
              sm:space-y-0 
              sm:space-x-4 
              mb-4
            "
              >
                <button
                  onClick={togglePlayPause}
                  className="
                  w-12 
                  h-12 
                  sm:w-14 
                  sm:h-14 
                  flex 
                  items-center 
                  justify-center 
                  rounded-full 
                  bg-indigo-600 
                  hover:bg-indigo-700 
                  text-white 
                  transition-all 
                  duration-300 
                  shadow-lg 
                  hover:shadow-xl 
                  transform 
                  hover:scale-105 
                  active:scale-95
                "
                >
                  {isPlaying ? (
                    <FaPause size={20} sm:size={24} />
                  ) : (
                    <FaPlay size={20} sm:size={24} />
                  )}
                </button>

                <div
                  className="
                w-full 
                flex 
                flex-col 
                sm:flex-row 
                items-center 
                space-y-2 
                sm:space-y-0 
                sm:space-x-4
              "
                >
                  <span
                    className="
                  text-sm 
                  text-gray-600 
                  w-16 
                  text-center 
                  sm:text-right
                "
                  >
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="
                    w-full 
                    h-2 
                    bg-gray-200 
                    rounded-lg 
                    appearance-none 
                    cursor-pointer 
                    slider-thumb:bg-indigo-600 
                    slider-thumb:rounded-full 
                    slider-thumb:w-4 
                    slider-thumb:h-4 
                    hover:slider-thumb:shadow-md
                  "
                  />
                  <span
                    className="
                  text-sm 
                  text-gray-600 
                  w-16 
                  text-center 
                  sm:text-right
                "
                  >
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Volume Control */}
              <div
                className="
              flex 
              flex-col 
              sm:flex-row 
              items-center 
              space-y-2 
              sm:space-y-0 
              sm:space-x-4
            "
              >
                <button
                  onClick={toggleMute}
                  className="
                  text-gray-600 
                  hover:text-indigo-600 
                  transition-colors 
                  duration-300 
                  transform 
                  hover:scale-110
                "
                >
                  {isMuted ? (
                    <FaVolumeMute size={20} />
                  ) : (
                    <FaVolumeUp size={20} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="
                  w-full 
                  sm:w-24 
                  h-2 
                  bg-gray-200 
                  rounded-lg 
                  appearance-none 
                  cursor-pointer 
                  slider-thumb:bg-indigo-600 
                  slider-thumb:rounded-full 
                  slider-thumb:w-4 
                  slider-thumb:h-4
                "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEpisode;
