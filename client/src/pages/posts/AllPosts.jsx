import PostCard from '@/components/posts/PostCard'
import React, { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import customFetch from '@/utils/customFetch'
import PostModal from '@/components/posts/PostModel';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';

export const allPostsAction = async ({ request }) => {
    const result = await request.formData();
    try {
        // Convert single tag to array before posting
        const tags = result.getAll('tags');
        if (tags.length) {
            result.delete('tags');
            tags.forEach(tag => result.append('tags[]', tag));
        }
        const response = await customFetch.post("/posts", result);
        console.log({ response });
        if (response.status === 201) {
            window.location.href = '/posts';
            toast.success("Post created successfully!");
        }
        return { success: response.data.msg };
    } catch (error) {
        toast.error(error?.response?.data?.msg || "An error occurred during post creation.");
        return { error: error?.response?.data?.msg || "An error occurred during post creation." };
    }
    return null;
};
export const allPostsLoader = async () => {
    try {
        const { data } = await customFetch.get("/posts");
        return { posts: data.posts };
    } catch (error) {
        console.log(error);
        return { error: error?.response?.data?.msg || "Could not fetch posts." };
    }
    return null;
};

const AllPosts = () => {
    const { posts } = useLoaderData();
    const [showModal, setShowModal] = useState(false);
    const { user } = useUser();

    return (

        <div >
            <div className=" mb-6 p-4 sm:p-6 bg-blue-50 rounded-[10px] shadow-sm text-center">
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
            {/* Posts List */}
            {posts?.length > 0 ? (
                posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        user={user}
                        comment="link"
                    />
                ))
            ) : (
                <div className="text-center p-8 bg-white rounded-[10px] shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Yet</h3>
                    <p className="text-gray-600">Be the first one to share your thoughts with the community!</p>
                </div>
            )}
            {showModal && <PostModal onClose={() => setShowModal(false)} />}
        </div>
    )
}

export default AllPosts
