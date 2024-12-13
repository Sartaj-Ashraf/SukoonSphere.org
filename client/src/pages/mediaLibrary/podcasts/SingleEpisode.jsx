import React, { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaUser } from "react-icons/fa";

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
const [episodeUser, setEpisodeUser] = useState(null);
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await customFetch.get(`/podcasts/${episodeId}`);
        setEpisode(response.data.podcast);
        setEpisodeUser(response.data.user);
        console.log({ response });
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
    const time = parseFloat(e.target.value);
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
    if (!time || isNaN(time)) return "0:00";
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
    <div className="min-h-screen py-4">
      <div className="w-full max-w-4xl mx-auto sm:px-4">
        {/* Title and Info Section */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100">
          {/* Author Section */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <Link to={`/about/user/${episodeUser._id}`} className="flex-shrink-0">
              {episodeUser.avatar ? (
                <img
                  src={episodeUser.avatar}
                  alt={episodeUser.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ring-2 ring-white shadow-md">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
              )}
            </Link>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900">{episodeUser.name || "Anonymous"}</h3>
              <p className="text-sm text-gray-600">Content Creator</p>
            </div>
          </div>

          {/* Title and Episode Info */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">{episode.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(episode.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(duration)}</span>
            </div>
            {episode.episodeNo && (
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Episode {episode.episodeNo}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">About this episode</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{episode.description}</p>
          </div>
        </div>

        {/* Audio Player Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] lg:grid-cols-[300px,1fr] gap-4 md:gap-6 lg:gap-8">
            {/* Left Column - Album Art */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl ring-1 ring-black/5 transform transition-all duration-300 hover:scale-105">
                <img
                  src={episode.imageUrl || '/default-podcast-cover.jpg'}
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Controls and Info */}
            <div className="flex flex-col justify-between space-y-4 md:space-y-0">
              {/* Episode Info */}
              <div className="text-center md:text-left">
                <h1 className="text-xl  md:text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{episode.title}</h1>
                <p className="text-base sm:text-lg text-blue-600 mb-2 sm:mb-4">{episode.author}</p>
                {/* <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-3 mb-2">{episode.description}</p> */}
                <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(duration)}
                  </span>
                  <span>•</span>
                  <span>{episode.createdAt ? new Date(episode.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Date not available'}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <div className="relative">
                  {/* Progress Background */}
                  <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg space-y-1">
                    <div 
                      className="h-full bg-blue-500 rounded-lg transition-all duration-150 "
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(duration - currentTime)}</span>
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8">
                <button
                  onClick={() => {
                    audioRef.current.currentTime = Math.max(0, currentTime - 10);
                  }}
                  className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95"
                  aria-label="Rewind 10 seconds"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                  </svg>
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-4 sm:p-5 md:p-6 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <FaPause className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  ) : (
                    <FaPlay className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => {
                    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                  }}
                  className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95"
                  aria-label="Forward 10 seconds"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.933 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                  </svg>
                </button>

                {/* Volume Control - Now Vertical and Responsive */}
                <div className="relative">
                  <button
                    onClick={toggleMute}
                    className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-200 active:scale-95 peer"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <FaVolumeMute className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-600" />
                    ) : (
                      <FaVolumeUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-600" />
                    )}
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-8 sm:w-10 h-32 sm:h-36 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-all duration-300 border border-gray-100 pointer-events-none peer-hover:pointer-events-auto hover:pointer-events-auto">
                    <div className="relative h-full flex items-center justify-center px-2">
                      {/* Volume Level Background */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1 h-24 sm:h-28 bg-gray-200 rounded-full">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-full transition-all duration-200"
                          style={{ height: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                      </div>
                      
                      {/* Volume Slider */}
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 sm:w-28 h-1.5 appearance-none bg-transparent cursor-pointer -rotate-90 origin-center"
                        aria-label="Volume"
                        style={{
                          '--thumb-size': '0px',
                          '--track-size': '4px'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={episode.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="hidden"
          />
        </div>
      </div>
      <style jsx>{`
        /* Progress bar custom styling */
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: var(--thumb-size);
          height: var(--thumb-size);
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #2563EB;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: #2563EB;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 100%;
          background: transparent;
          border-radius: 999px;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 100%;
          background: transparent;
          border-radius: 999px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SingleEpisode;
