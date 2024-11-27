import { useUser } from '@/context/UserContext';
import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import DeleteModal from '@/components/shared/DeleteModal';
import { Link, useOutletContext } from 'react-router-dom';
import UserAvatar from '@/components/shared/UserAvatar';
import PostCard from '@/components/posts/PostCard';

const UserPosts = () => {
    const user = useOutletContext();
    const {user: loggedUser} = useUser();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);

    const fetchUserPosts = async () => {
        try {
            const { data } = await customFetch.get(`/posts/user/${user._id}`);
            setPosts(data.posts);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchUserPosts();
        }
    }, [user?._id]);

    const handlePostDelete = async () => {
        setIsDeleting(true);
        try {
            await customFetch.delete(`/posts/${selectedPostId}`);
            setPosts(posts.filter(post => post._id !== selectedPostId));
            setShowDeleteModal(false);
        } catch (error) {
            console.log(error);
        }
        setIsDeleting(false);
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post._id === updatedPost._id ? updatedPost : post
            )
        );
    };

    const filteredPosts = posts.filter(post => 
        (post.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        post.tags?.some(tag => (tag?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm">
            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search in posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                </div>
            </div>

            {/* Posts Count */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Posts <span className="text-blue-500 ml-2">{filteredPosts.length}</span>
                </h2>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
                <div className="text-center py-12 px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchQuery ? 'No matching posts found' : 'No posts yet'}
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        {searchQuery 
                            ? 'Try searching with different keywords'
                            : 'Share your thoughts and experiences with the community!'}

                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            user={loggedUser}
                            onPostDelete={handlePostDelete}
                            onPostUpdate={handlePostUpdate}
                        />
                    ))}
                </div>
            )}

            {showDeleteModal && (
                <DeleteModal
                    isOpen={showDeleteModal}
                    closeModal={() => setShowDeleteModal(false)}
                    onDelete={handlePostDelete}
                    isDeleting={isDeleting}
                    title="Delete Post"
                    message="Are you sure you want to delete this post? This action cannot be undone."
                />
            )}
        </div>
    );
};

export default UserPosts;
