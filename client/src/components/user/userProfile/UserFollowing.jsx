import React, { useState } from "react";
import customFetch from "@/utils/customFetch";
import { useLoaderData, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { FaUserPlus, FaUserMinus, FaSearch } from "react-icons/fa";

export const userFollowingLoader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/user/following/${params.id}`);
    return data;
  } catch (error) {
    console.error("Error fetching following:", error);
    toast.error(error.response?.data?.msg || "Error fetching following");
    return { success: false, following: [] };
  }
};

const UserFollowing = () => {
  const data = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState({});

  const following = data?.following || [];



  const filteredFollowing = following.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!Array.isArray(following)) {
    return (
      <div className="text-center py-12 px-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Unable to load following
        </h2>
        <p className="text-gray-500 mt-2">
          Please refresh the page to try again
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search following by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>

      {/* Following Count */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Following{" "}
          <span className="text-blue-500 ml-2">{filteredFollowing.length}</span>
        </h2>
      </div>

      {/* Following Grid */}
      {filteredFollowing.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserPlus className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery
              ? "No matching users found"
              : "Not following anyone yet"}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try searching with a different name"
              : "Explore and follow other users to see their updates!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFollowing.map((following) => (
            <div
              key={following._id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <Link
                  to={`/about/user/${following._id}`}
                  className="flex-shrink-0 group"
                >
                  <img
                    src={
                      following.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(following.name || "User")}&background=random`
                    }
                    alt={following.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors duration-300"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/about/user/${following._id}`}
                    className="block group"
                  >
                    <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                      {following.name || "Anonymous User"}
                    </h3>
                  </Link>
                  <div className="flex gap-4 mt-1 text-sm text-gray-500">
                    <Link
                      to={`/about/user/${following._id}/followers`}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      <span className="font-medium">
                        {following.totalFollowers || 0}
                      </span>
                      <span className="ml-1">followers</span>
                    </Link>
                    <Link
                      to={`/about/user/${following._id}/following`}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      <span className="font-medium">
                        {following.totalFollowing || 0}
                      </span>
                      <span className="ml-1">following</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFollowing;
