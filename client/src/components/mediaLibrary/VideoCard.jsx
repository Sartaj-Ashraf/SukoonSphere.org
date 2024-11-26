import React from 'react';
import { FaRegCirclePlay } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function VideoCard({ videos }) {
    return (
        <>
            {videos.map((video, index) => (
                <div key={index} className="group bg-white shadow-lg  overflow-hidden transform transition-transform duration-300 ease-in-out hover:scale-[101%] rounded-lg" >
                    <Link to={`video/${video.id}`}>
                        <div className="relative">
                            {/* Image or Thumbnail */}
                            <img src={video.image} alt={video.title} className="w-full h-40 object-cover text-[#13404f]" />
                            <span className="absolute bottom-3 right-3 text-xs text-[var(--secondary)] badge badge-outline bg-[var(--light-bg)]">
                                {video.category}
                            </span>

                            {/* Play Icon */}
                            <div className="absolute top-2 right-2">
                                <div className="rounded-full bg-[var(--primary)] text-white p-2 transform scale-75 transition-transform duration-500 ease-in-out group-hover:scale-110">
                                    <FaRegCirclePlay size={32} />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Video Info */}
                    <div className="p-4" data-aos="fade-up" data-aos-duration="1500">
                        <Link to={`/media/all-videos/video/${video.id}`}>
                            <h1 className="text-xl font-bold text-[#13404f] line-clamp-2 hover:text-[var(--ternery)]">{video.title}</h1>
                        </Link>
                        <p className="mt-2 text-sm text-[var(--grey--800)] line-clamp-2">{video.description}</p>

                        {/* Additional Details */}
                        <div className="mt-4">
                            <p className="font-medium text-sm text-[var(--black-color)]">Views: <span className="font-normal text-[var(--black-color)] mr-2">{video.views}</span>
                                Watch Time: <span className="font-normal text-[var(--black-color)]">{video.watchTime}</span></p>
                            {/* <p className="font-medium text-sm text-[var(--black-color)]">Published on: <span className="font-normal text-[var(--black-color)]">{video.datePublished}</span></p> */}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default VideoCard;
