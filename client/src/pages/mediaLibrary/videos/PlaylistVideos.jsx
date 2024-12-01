import VideoCard from '@/components/mediaLibrary/videos/VideoCard';
import React from 'react'
import { useLoaderData } from 'react-router-dom';
const PlaylistVideos = () => {
    const { videos } = useLoaderData();
    console.log({videos})
    return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos?.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>  
    )
}

export default PlaylistVideos;
