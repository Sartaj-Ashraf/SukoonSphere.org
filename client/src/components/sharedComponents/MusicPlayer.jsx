import React, { useState, useEffect, useRef } from "react";

const MusicPlayer = ({ currentAudio, currentPodcast }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentAudio) {
      audioRef.current.src = currentAudio;
      audioRef.current.load();
      setIsPlaying(true);
      audioRef.current.play();
    }
  }, [currentAudio]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const CustomIcon = ({ name }) => {
    switch (name) {
      case 'play':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        );
      case 'pause':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        );
      case 'skip-back':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        );
      case 'skip-forward':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        );
      case 'shuffle':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
          </svg>
        );
      case 'repeat':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        );
      case 'download':
        return (
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sticky top-24 lg:w-96 p-6 bg-[#0b3948] mx-auto rounded-xl text-white font-sans">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-medium">Now Playing</span>
        <button className="bg-transparent border-0 text-gray-400 cursor-pointer p-1">
          <CustomIcon name="download" />
        </button>
      </div>

      {/* Album Art */}
      <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
        <img
          src={currentPodcast?.image || "/api/placeholder/128/128"}
          alt="Album art"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold mb-1">{currentPodcast?.title || "Select a podcast"}</h2>
        <p className="text-sm text-gray-400">{currentPodcast?.author || "Artist"}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          value={currentTime}
          max={duration || 0}
          onChange={handleSeek}
          className="w-full h-1 mb-2 appearance-none bg-gray-600 rounded cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <button className="bg-transparent border-0 text-gray-400 cursor-pointer p-1">
          <CustomIcon name="shuffle" />
        </button>
        <button className="bg-transparent border-0 text-gray-400 cursor-pointer p-1">
          <CustomIcon name="skip-back" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 flex items-center justify-center bg-white border-0 rounded-full text-[#1a2433] cursor-pointer"
          disabled={!currentAudio}
        >
          <CustomIcon name={isPlaying ? 'pause' : 'play'} />
        </button>
        <button className="bg-transparent border-0 text-gray-400 cursor-pointer p-1">
          <CustomIcon name="skip-forward" />
        </button>
        <button className="bg-transparent border-0 text-gray-400 cursor-pointer p-1">
          <CustomIcon name="repeat" />
        </button>
      </div>

      {/* Bottom Text */}
      <div className="text-center">
        <button className="bg-transparent border-0 text-gray-400 text-sm cursor-pointer p-1">
          Playlist
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;