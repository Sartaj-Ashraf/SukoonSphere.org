import { useUser } from '@/context/UserContext';
import UserProfileModel from '../modals/UserProfileModel';
import { useState } from 'react';
import { FaEdit, FaHeart, FaComment, FaBookmark, FaQuestion } from 'react-icons/fa';
import { FcAnswers } from "react-icons/fc";
const ProfileCard = () => {
    const [showModal, setShowModal] = useState(false);
    const { user, updateUser } = useUser();
    console.log({ user });

    const handleProfileUpdate = async (formData) => {
        try {
            const reponse = await updateUser(formData);
            if (reponse.success) {
                setShowModal(false);
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-[8px] max-w-7xl mx-auto">
            <div className="relative h-32 rounded-t-2xl">
                {/* <button
                    onClick={() => setShowModal(true)}
                    className="absolute bottom-4 right-4 bg-gray-700 p-2 rounded-full hover:bg-gray-800 transition-all"
                >
                    <FaEdit className="text-white hover:text-[var(--ternery)]" size={20} />
                </button> */}
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Anonymous')}&background=random`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="px-6 pb-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center -mt-12">
                    <div className="relative">
                        <div className="p-1 rounded-full bg-white">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Anonymous')}&background=random`}
                                alt="Profile"
                                className="rounded-full w-24 h-24 border-4 border-white shadow-lg object-cover"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mt-2 text-gray-800">
                        {user?.name || 'Anonymous'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        @{user?.name?.toLowerCase().replace(/\s+/g, '_') || 'anonymous'}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex justify-center space-x-8 mt-6 border-y border-gray-100 py-4">
                    <div className="text-center">
                        <div className="font-bold text-gray-800">{user?.posts?.length || 0}</div>
                        <div className="text-sm text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-gray-800">{user?.followers?.length || 0}</div>
                        <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-gray-800">{user?.following?.length || 0}</div>
                        <div className="text-sm text-gray-500">Following</div>
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="mt-6 flex justify-center items-center gap-4">
                    <div className="flex flex-col items-center justify-center text-center">
                        <FaQuestion className="text-pink-500 text-xl mb-1" />
                        <div className="text-sm font-semibold">{user?.questions?.length || 0}</div>
                        <div className="text-xs text-gray-500">Questions Asked</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <FcAnswers className="text-blue-500 text-xl mb-1" />
                        <div className="text-sm font-semibold">{user?.answers?.length || 0}</div>
                        <div className="text-xs text-gray-500">Answers Posted</div>
                    </div>
                    {user?.role === "contributor" && (
                        <div className="flex flex-col items-center justify-center text-center">
                            <FaBookmark className="text-purple-500 text-xl mb-1" />
                            <div className="text-sm font-semibold">{user?.articles?.length || 0}</div>
                            <div className="text-xs text-gray-500">Articles Posted</div>
                        </div>
                    )}
                </div>

            </div>
            {/* {showModal && <UserProfileModel onClose={() => setShowModal(false)} user={user} handleProfileUpdate={handleProfileUpdate} />} */}
        </div>
    );
};

export default ProfileCard;
