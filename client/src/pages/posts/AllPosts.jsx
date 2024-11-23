import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import PostCard from '@/components/posts/PostCard';
import PostModal from '@/components/posts/PostModel';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

export const allPostsLoader = async () => {
    try {
        const { data } = await customFetch.get("/posts");
        return { posts: data.posts };
    } catch (error) {
        toast.error(error?.response?.data?.msg);
        return { posts: [] };
    }
};

const AllPosts = () => {
    const { posts } = useLoaderData();
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <div className="mb-6 p-4 sm:p-6 bg-blue-50 rounded-[10px] shadow-sm text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Share Your Thoughts!</h2>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    Got something on your mind? Share your experiences, tips, and thoughts with the community.
                </p>
                <button
                    onClick={() => {
                        if (!user) {
                            toast.error("Please login to create a post!");
                            return;
                        }
                        setShowModal(true);
                    }}
                    className="action-button w-full sm:w-auto"
                >
                    Add Post
                </button>
            </div>

            {showModal && <PostModal onClose={() => setShowModal(false)} />}

            {/* Posts List */}
            {posts?.length > 0 ? (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            user={user}
                            comment="link"
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-white rounded-[10px] shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h3>
                    <p className="text-gray-600">Be the first one to share your thoughts with the community!</p>
                </div>
            )}
        </div>
    );
};

export default AllPosts;
