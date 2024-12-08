import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import customFetch from '@/utils/customFetch';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!episode) return <div className="text-gray-500 text-center py-8">Episode not found</div>;

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Episode Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
              <div className="absolute bottom-8 left-8 text-white">
                <h1 className="text-4xl font-bold mb-3">{episode.title}</h1>
                <div className="flex items-center space-x-4 text-gray-200">
                  <span className="text-sm">Episode {episode.episodeNo}</span>
                  <span>•</span>
                  <span className="text-sm">{new Date(episode.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-700 leading-relaxed mb-8">{episode.description}</p>

            {/* Audio Player */}
            <div className="bg-gray-50 rounded-xl p-6">
              <audio
                ref={audioRef}
                src={episode.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
              />

              {/* Play/Pause and Progress */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>

                <div className="flex-1 flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-16">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 w-16">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleMute}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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