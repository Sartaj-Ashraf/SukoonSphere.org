import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';

const AllPodcasts = () => {
    const { podcasts } = useLoaderData();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts?.map((podcast) => (
                    <Link 
                        to={`episodes/${podcast._id}`} 
                        key={podcast._id}
                        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="relative">
                            <img 
                                src={podcast.coverImage} 
                                alt={podcast.title} 
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <span className="text-white text-sm font-medium">
                                    {podcast.episodeCount} Episodes
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {podcast.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                {podcast.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <img 
                                        src={podcast.hostAvatar} 
                                        alt={podcast.hostName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {podcast.hostName}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(podcast.lastUpdated).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AllPodcasts;
