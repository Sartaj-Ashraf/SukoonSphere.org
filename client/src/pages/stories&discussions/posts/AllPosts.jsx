import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import PostCard from '@/components/posts/PostCard';
import PostModal from '@/components/posts/PostModel';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

const AllPosts = () => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const { ref, inView } = useInView();

    // Set up infinite query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await customFetch.get(`/posts?page=${pageParam}&limit=10`);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            // Only return next page if we have more posts and haven't reached the total pages
            return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
        },
        // Add these options to prevent unnecessary refetching
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Fetch next page when last element is in view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handlePostUpdate = async (updatedPost) => {
        await refetch(); // Refetch all posts to ensure consistency
    };

    if (status === 'loading') {
        return <div className="text-center py-4">Loading posts...</div>;
    }

    if (status === 'error') {
        return <div className="text-center text-red-500 py-4">Error loading posts</div>;
    }

    const allPosts = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div>
            <div className="mb-6 p-4 sm:p-6 bg-blue-50 rounded-lg shadow-sm text-center">
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

            {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={() => refetch()} />}

            {/* Posts List */}
            {allPosts.length > 0 ? (
                <div className="space-y-4">
                    {allPosts.map((post, index) => (
                        <PostCard
                            key={`${post._id}-${index}`} // Add index to ensure unique keys
                            post={post}
                            user={user}
                            onPostUpdate={handlePostUpdate}
                        />
                    ))}
                    
                    {/* Loading indicator - only show if we have more posts to load */}
                    <div ref={ref} className="py-4 text-center">
                        {isFetchingNextPage && (
                            <div className="text-gray-500">Loading more posts...</div>
                        )}
                        {!isFetchingNextPage && hasNextPage && (
                            <div className="text-gray-400">Scroll for more</div>
                        )}
                        {!isFetchingNextPage && !hasNextPage && allPosts.length > 0 && (
                            <div className="text-gray-400">That's all folks! You've reached the end of the posts.</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-8">
                    No posts found. Be the first to share something!
                </div>
            )}
        </div>
    );
};

export default AllPosts;
