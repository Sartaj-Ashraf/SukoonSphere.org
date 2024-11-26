import React, { useState } from 'react';
import {
    FaVideo,
    FaFileAlt,
    FaCommentDots,
    FaShareAlt,
    FaKey,
    FaUserPlus,
    FaRocket,
    FaGlobe,
    FaTrophy
} from 'react-icons/fa';

const GetAKey = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submission', { name, email, message });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2 gap-0">
                {/* Left Section */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-12 flex flex-col justify-center">
                    <div className="mb-10">
                        <FaRocket className="w-16 h-16 text-white mb-6 opacity-80" />
                        <h2 className="text-5xl font-extrabold mb-6 text-white leading-tight">
                            Elevate Your Impact
                        </h2>
                        <p className="text-xl mb-8 text-indigo-100 font-light">
                            Transform your passion into meaningful contributions. Here's how you can make a difference:
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                icon: FaGlobe,
                                title: 'Global Reach',
                                description: 'Expand your influence beyond boundaries'
                            },
                            {
                                icon: FaTrophy,
                                title: 'Recognition',
                                description: 'Showcase your expertise and achievements'
                            },
                            {
                                icon: FaShareAlt,
                                title: 'Collaborative Growth',
                                description: 'Connect with like-minded innovators'
                            }
                        ].map(({ icon: Icon, title, description }, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-6 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition duration-300"
                            >
                                <Icon className="w-10 h-10 text-yellow-300" />
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                                    <p className="text-indigo-100 text-sm">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className="p-12 bg-white flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <div className="flex justify-center mb-6">
                                <FaKey className="w-20 h-20 text-indigo-600 animate-pulse" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-800 mb-4">
                                Unlock Your Potential
                            </h3>
                            <p className="text-gray-500 text-lg">
                                Join our exclusive contributor network
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">
                                    Your Contribution Vision
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Share your unique contribution idea"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-300"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <FaUserPlus className="mr-3" />
                                Claim Your Spot
                            </button>
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            Your journey of impact starts here. We'll review and connect soon!
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GetAKey;