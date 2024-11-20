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
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 max-w-7xl mx-auto">
            <div className="relative h-32 rounded-t-2xl overflow-hidden">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Anonymous')}&background=random`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-t-2xl transform hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="px-4 pb-4">
                {/* Profile Header */}
                <div className="flex flex-col items-center -mt-12">
                    <div className="relative">
                        <div className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'Anonymous')}&background=random`}
                                alt="Profile"
                                className="rounded-full w-24 h-24 border-4 border-white shadow-lg object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mt-2 text-gray-800 hover:text-[var(--ternery)] transition-colors duration-300">
                        {user?.name || 'Anonymous'}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors duration-300">
                        @{user?.name?.toLowerCase().replace(/\s+/g, '_') || 'anonymous'}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex justify-center space-x-8 mt-4 border-y border-gray-100 py-3">
                    <div className="text-center group cursor-pointer">
                        <div className="font-bold text-gray-800 group-hover:text-[var(--ternery)] transition-colors duration-300">{user?.posts?.length || 0}</div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">Posts</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                        <div className="font-bold text-gray-800 group-hover:text-[var(--ternery)] transition-colors duration-300">{user?.followers?.length || 0}</div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">Followers</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                        <div className="font-bold text-gray-800 group-hover:text-[var(--ternery)] transition-colors duration-300">{user?.following?.length || 0}</div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">Following</div>
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="mt-4 flex justify-center items-center gap-6">
                    <div className="flex flex-col items-center justify-center text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                        <FaQuestion className="text-pink-500 text-xl mb-1 group-hover:text-pink-600" />
                        <div className="text-sm font-semibold group-hover:text-[var(--ternery)]">{user?.questions?.length || 0}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-700">Questions Asked</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                        <FcAnswers className="text-blue-500 text-xl mb-1 group-hover:text-blue-600" />
                        <div className="text-sm font-semibold group-hover:text-[var(--ternery)]">{user?.answers?.length || 0}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-700">Answers Posted</div>
                    </div>
                    {user?.role === "contributor" && (
                        <div className="flex flex-col items-center justify-center text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                            <FaBookmark className="text-purple-500 text-xl mb-1 group-hover:text-purple-600" />
                            <div className="text-sm font-semibold group-hover:text-[var(--ternery)]">{user?.articles?.length || 0}</div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-700">Articles Posted</div>
                        </div>
                    )}
                </div>

            </div>
            {/* {showModal && <UserProfileModel onClose={() => setShowModal(false)} user={user} handleProfileUpdate={handleProfileUpdate} />} */}
        </div>
    );
};

export default ProfileCard;
