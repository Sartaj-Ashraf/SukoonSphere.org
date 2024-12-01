import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaVideo, FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";

const CreateVideoModel = ({ setShowModal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [type, setType] = useState("single");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('videoUrl', videoUrl.trim());
            formData.append('type', type);
            formData.append('coverImage', coverImage);

            const response = await customFetch.post("/videos/create-video", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.status === 201) {
                toast.success("Video created successfully!");
                // window.location.reload();
                
                setShowModal(false);
               
            }
        } catch (error) {
            console.error('Error creating video:', error);
            toast.error(error.response?.data?.msg || "Error creating video");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size should be less than 5MB");
                return;
            }
       
            setCoverImage(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10">
            <div className="bg-[var(--body)] rounded-2xl p-6 w-[600px] shadow-2xl transform transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
                        <FaVideo className="text-primary" />
                        Create New Video
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter video title..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 placeholder-ternary"
                            
                        />
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter video description..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 placeholder-ternary min-h-[100px]"
                        />
                    </div>

                    <div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                        >
                            <option value="single">Single Video</option>
                            <option value="playlist">Playlist</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="Enter video URL..."
                            className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 placeholder-ternary"
                            
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Cover Image*
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                        >
                            <FaVideo />
                            {isSubmitting ? "Creating..." : "Create Video"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVideoModel;
