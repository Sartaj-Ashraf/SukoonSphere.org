import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';

const PodcastEpisodes = () => {
    const { podcast, episodes } = useLoaderData();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Podcast Header */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                    <img 
                        src={podcast.coverImage} 
                        alt={podcast.title}
                        className="w-full md:w-64 h-64 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {podcast.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {podcast.description}
                        </p>
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
                                <p className="text-gray-600 dark:text-gray-400">Host</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{episodes.length} Episodes</span>
                            <span>•</span>
                            <span>Updated {new Date(podcast.lastUpdated).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
                {episodes.map((episode) => (
                    <Link
                        to={`/media/podcasts/episode/${episode._id}`}
                        key={episode._id}
                        className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <img 
                                src={episode.thumbnail || podcast.coverImage} 
                                alt={episode.title}
                                className="w-full md:w-48 h-32 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {episode.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                    {episode.description}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {new Date(episode.releaseDate).toLocaleDateString()}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {episode.duration}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PodcastEpisodes;
