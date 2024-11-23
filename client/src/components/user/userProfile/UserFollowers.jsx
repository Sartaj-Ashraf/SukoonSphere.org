import React from 'react';
import customFetch from '@/utils/customFetch';
import { useLoaderData, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '@/context/UserContext';

export const userFollowersLoader = async ({ params }) => {
    try {
        const { data } = await customFetch.get(`/user/followers/${params.id}`);
        console.log('Followers Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching followers:', error);
        toast.error(error.response?.data?.msg || 'Error fetching followers');
        return { followers: [] };
    }
};

const UserFollowers = () => {
    const { id } = useParams(); // Get the user ID from URL params
    const { followers = [] } = useLoaderData() || {};
    const { user } = useUser();

    console.log('Component followers:', followers);

    if (!Array.isArray(followers) || followers.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-gray-700">No followers yet</h2>
                <p className="text-gray-500 mt-2">Start engaging with the community to gain followers!</p>
            </div>
        );
    }

    const handleFollowToggle = async (targetUserId) => {
        try {
            const response = await customFetch.patch(`/user/follow/${targetUserId}`);
            if (response.data.success) {
                toast.success(response.data.isFollowing ? 'User followed!' : 'User unfollowed');
                // Refresh the data without full page reload
                window.location.reload();
            }
        } catch (error) {
            console.error('Follow toggle error:', error);
            toast.error(error.response?.data?.msg || 'Error updating follow status');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Followers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followers.map((follower) => (
                    <div key={follower._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-4">
                            <img
                                src={follower.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.name)}&background=random`}
                                alt={follower.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-800">{follower.name}</h3>
                                <p className="text-gray-500 text-sm">{follower.email}</p>
                                <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="font-medium">{follower.totalFollowers}</span>
                                        <span className="ml-1">followers</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">{follower.totalFollowing}</span>
                                        <span className="ml-1">following</span>
                                    </div>
                                </div>
                                {follower._id !== user?.userId && (
                                    <button
                                        onClick={() => handleFollowToggle(follower._id)}
                                        className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                                            follower.isFollowing
                                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        {follower.isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserFollowers;
