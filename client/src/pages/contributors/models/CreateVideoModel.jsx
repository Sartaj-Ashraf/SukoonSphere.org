import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaVideo, FaTimes, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";

const CreateVideoModel = ({ setShowModal }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [type, setType] = useState("single");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const handleAddTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !videoUrl.trim() || !coverImage) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('videoUrl', videoUrl.trim());
            formData.append('type', type);
            formData.append('tags', JSON.stringify(tags));
            formData.append('coverImage', coverImage);

            const response = await customFetch.post("/videos/create-video", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.status === 201) {
                toast.success("Video created successfully!");
                window.location.reload();
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
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file");
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
                            required
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
                            required
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
                            required
                        />
                    </div>

                    <div>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Add a tag..."
                                className="flex-1 px-3 py-1.5 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                            />
                            <button
                                onClick={handleAddTag}
                                type="button"
                                className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-500"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
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
