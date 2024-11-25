import React, { useState } from 'react';
import { useActionData, useNavigation } from "react-router-dom";

const UserProfileModel = ({ onClose, user, handleProfileUpdate }) => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const data = useActionData();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.target);
        try {
            const response = await handleProfileUpdate(formData);
            window.location.reload();
        } catch (error) {
            console.log({ errorInModel: error })
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all">
                <div className="px-6 sm:px-8 py-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
                        Update Your Profile
                    </h2>

                    <form
                        method="post"
                        encType="multipart/form-data"
                        className=""
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Update your name
                            </label>
                            <input
                                name="name"
                                required
                                className="bg-[var(--white-color)] w-full px-4 py-3 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[80px] "
                                placeholder="Enter new name..."
                                defaultValue={user?.name}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Update Your Profile Picture
                            </label>
                            <div className="rounded-[10px] h-[40px] mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed hover:border-blue-500 transition-colors">
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                        <span>Upload a photo</span>
                                        <input
                                            type="file"
                                            name="avatar"
                                            className="sr-only"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-3 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-[10px] border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`btn-2 relative ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="opacity-0">Update Profile</span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </>
                                ) : (
                                    "Update Profile"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModel;