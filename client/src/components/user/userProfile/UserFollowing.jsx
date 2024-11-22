import React, { useEffect, useState } from 'react'
import customFetch from '@/utils/customFetch';
import { useOutletContext } from 'react-router-dom';
const UserFollowing = () => {
    const user = useOutletContext();
    const [following, setFollowing] = useState([])

    const fetUserFollowing = async () => {
        try {
            const { data } = await customFetch.get(`/user/following/${user._id}`);
            setFollowing(data.following);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetUserFollowing()
    }, [])

    const handleUnfollow = async (userId) => {
        try {
            await customFetch.post(`/user/unfollow/${userId}`);
            window.location.reload();
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <div className="bg-white p-4">
            <h2 className="text-xl font-bold mb-4 text-[var(--black-color)] text-center">Following</h2>
            <div className="divide-y divide-gray-200">
                {following.length == 0 ? (
                    <p className="text-center text-gray-500 py-4">Not following anyone yet</p>
                ) : (
                    following?.map((user) => (
                        <div key={user.name} className="py-2 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-lg">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <h1 className='text-xl text-[var(--primary)]'>
                                            {user.name[0]}
                                        </h1>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-base text-[var(--primary)]">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>
                            {/* <button
                                className="action-button btn-sm"
                                onClick={() => handleUnfollow(user._id)}
                            >
                                Unfollow
                            </button> */}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default UserFollowing
