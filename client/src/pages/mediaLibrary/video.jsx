import { RelatedVideoCard } from '@/components';
import { videos } from '@/utils/Vidoes/AllVidoes';
import { FaPlay } from 'react-icons/fa';
import { useLoaderData } from 'react-router-dom';

export const SingleVideoDetailsLoader = async ({ params }) => {
    const videoDetails = videos.find(video => video.id === Number(params.id));
    return { videoDetails: videoDetails };
};

const video = () => {
    const { videoDetails } = useLoaderData()
    return (
        <>
            <div className="relative max-w-7xl mx-auto w-full px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-12 md:col-span-8">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                                {videoDetails.title}
                            </h1>

                            {/* Video Player */}
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-8 group max-w-xl mx-auto">
                                <img
                                    src="https://via.placeholder.com/800x450"
                                    alt="Vaccination video thumbnail"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity group-hover:bg-opacity-20" />
                                <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full text-white p-6 shadow-xl transition-transform duration-300 group-hover:scale-110">
                                    <FaPlay className="text-2xl" />
                                </button>
                            </div>

                            {/* Video Info */}
                            <div className="space-y-6">
                                {/* Author Info */}
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                    <img
                                        src={videoDetails.avatar}
                                        alt={videoDetails.author}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-blue-600">{videoDetails.author}</h4>
                                        <p className="text-sm text-gray-500">
                                            Published on {new Date(videoDetails.datePublished).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 leading-relaxed">
                                    {videoDetails.description}
                                </p>

                                {/* Stats */}
                                <div className="flex justify-between items-center py-4 border-t border-b border-gray-100">
                                    <span className="text-sm text-gray-600 flex items-center">
                                        <span className="font-medium mr-1">Views:</span> {videoDetails.views}
                                    </span>
                                    <span className="text-sm text-gray-600 flex items-center">
                                        <span className="font-medium mr-1">Duration:</span> {videoDetails.watchTime}
                                    </span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {videoDetails.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 md:col-span-4 sticky top-6 h-screen ">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4">
                            <RelatedVideoCard title={"Related Videos"} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default video;
