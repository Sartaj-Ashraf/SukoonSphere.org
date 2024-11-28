import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { FaUsers, FaUser, FaEye } from 'react-icons/fa';

function OurTeam() {
    // Fetch data from the loader (replace with actual data)
    const data = useLoaderData();
    // Display a fallback if `data.posts` is missing or empty
    if (!data?.posts || data.posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-xl text-gray-500 font-semibold">No contributor yet</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--grey--900)] mb-2 tracking-tight">
                    SukoonSphere Contributors
                </h2>
                <p className="text-xl text-[var(--grey--800)] max-w-3xl mx-auto">
                    Our qualified physicians and mental health experts ensure compassionate, accurate, and inclusive content that prioritizes your well-being.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {data?.posts?.map((member) => (
                    <div
                        key={member?._id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                        data-aos="zoom-in-up"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={member?.avatar || "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"}
                                alt={member?.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Link
                                    to={`/about/user/${member._id}`}
                                    className="bg-white text-black px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-opacity-90"
                                >
                                    <FaEye className="w-5 h-5" />
                                    <span>View Profile</span>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <Link to={`/about/user/${member?._id}`}>
                                <h3 className="text-2xl font-bold text-[var(--grey--900)] mb-2 group-hover:text-blue-600 transition-colors">
                                    {member?.name}
                                </h3>
                            </Link>
                            <div className="flex justify-center space-x-4 text-[var(--grey--800)]">
                                <div className="flex items-center space-x-1">
                                    <FaUsers className="w-5 h-5" />
                                    <span>{member.followers?.length || 0} Followers</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FaUser className="w-4 h-4" />
                                    <span>{member.following?.length || 0} Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OurTeam;
