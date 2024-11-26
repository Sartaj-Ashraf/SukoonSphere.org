import React, { useState } from "react";
import { GroupsSidebar, ProfileSidebar } from "@/components";
import { Outlet } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const Posts = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  const groups = [
    {
      id: 1,
      name: "Mindfulness Practices 🧘‍♂️",
      image: "https://example.com/image_mindfulness.jpg",
    },
    {
      id: 2,
      name: "Coping with Anxiety 💭",
      image: "https://example.com/image_anxiety.jpg",
    },
    {
      id: 3,
      name: "Therapy Techniques 📖",
      image: "https://example.com/image_therapy.jpg",
    },
    {
      id: 4,
      name: "Depression Support Group ❤️",
      image: "https://example.com/image_depression.jpg",
    },
    {
      id: 5,
      name: "Stress Management Workshops 🌱",
      image: "https://example.com/image_stress.jpg",
    },
  ];


  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 py-4">
      <div className="grid grid-cols-12 gap-2">
        {/* Left Sidebar - Groups */}
        <div className="rounded-lg shadow-sm hidden lg:block lg:col-span-3 h-screen overflow-y-auto">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">Starting soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {/* Add Post Card */}
          <div className="overflow-y-auto max-h-screen no-scrollbar rounded-lg">
            <Outlet />
          </div>
        </div>

        {/* Right Sidebar - Profile */}
        <div className="hidden shadow-sm lg:block lg:col-span-3  rounded-lg">
          {/* <ProfileSidebar
            username={user ? user.name : "Anonymous"}
            userTag="Mental Health Advocate"
            questionsPosted={33}
            answersPosted={44}
            savedItems={["Mindfulness Techniques", "Stress Reduction"]}
            recentItems={["Mental Health", "Mindfulness Practices"]}
            groups={["Mindfulness and Meditation", "Therapy Techniques"]}
            followedHashtags={["#mentalhealth", "#mindfulness", "#selfcare"]}
            events={["Mental Wellness Workshop", "Mindfulness Session"]}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Posts;
