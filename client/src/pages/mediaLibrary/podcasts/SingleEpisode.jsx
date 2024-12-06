import React, { useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

const SingleEpisode = () => {
    const { episode, podcast } = useLoaderData();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Episode Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <img 
                            src={episode.thumbnail || podcast.coverImage} 
                            alt={episode.title}
                            className="w-full md:w-72 h-72 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {episode.title}
                            </h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <img 
                                    src={podcast.hostAvatar} 
                                    alt={podcast.hostName}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {podcast.hostName}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">{podcast.title}</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Released on {new Date(episode.releaseDate).toLocaleDateString()}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                {episode.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                    <audio 
                        ref={audioRef}
                        src={episode.audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        className="hidden"
                    />
                    
                    <div className="flex flex-col space-y-4">
                        {/* Play/Pause Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={togglePlayPause}
                                className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
                            >
                                {isPlaying ? (
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleEpisode;
