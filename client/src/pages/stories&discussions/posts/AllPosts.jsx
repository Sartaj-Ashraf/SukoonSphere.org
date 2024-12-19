import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import PostCard from '@/components/posts/PostCard';
import PostModal from '@/components/posts/PostModel';
import PostFilter from '@/components/posts/PostFilter';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import { FaPlusCircle } from 'react-icons/fa';

const AllPosts = () => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('newest');
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
        queryKey: ['posts', activeFilter],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await customFetch.get(`/posts?page=${pageParam}&limit=10&sortBy=${activeFilter}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 5 * 60 * 1000,
    });

    // Fetch next page when last element is in view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handlePostUpdate = async (updatedPost) => {
        await refetch();
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
   <div className="relative bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-2">
      <div className="absolute inset-0 opacity-5 bg-pattern"></div>
      
      <div className="relative z-10 text-center">
        <div className="mb-5 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 tracking-tight">
            Share Your Thoughts!lkj;sakfd
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Got something on your mind? Share your experiences, tips, and thoughts with the community.
          </p>
        </div>
        
        <button
          onClick={() => {
            if (!user) {
              toast.error("Please login to create a post!");
              return;
            }
            setShowModal(true);
          }}
          className="group relative inline-flex items-center justify-center 
            px-6 py-3 overflow-hidden font-medium transition duration-300 
            ease-out border border-gray-200 bg-white rounded-lg shadow-sm
            hover:bg-gray-50 hover:border-gray-300 focus:outline-none 
            active:scale-95 transform "
        >
          <FaPlusCircle 
            className="mr-2 text-gray-500 group-hover:text-gray-700 
            transition duration-300 ease-out"
            size={24}
          />
          <span className="relative text-gray-600 group-hover:text-gray-800">
            Add Post
          </span>
        </button>
      </div>
    </div>

            {showModal && <PostModal onClose={() => setShowModal(false)} onPostCreated={() => refetch()} />}

            {/* Filter Component */}
            <PostFilter 
                activeFilter={activeFilter}
                onFilterChange={(filter) => {
                    setActiveFilter(filter);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />

            {/* Posts List */}
            {allPosts.length > 0 ? (
                <div className="space-y-4">
                    {allPosts.map((post, index) => (
                        <PostCard
                            key={`${post._id}-${index}`}
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
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">No posts found</div>
            )}
        </div>
    );
};

export default AllPosts;
