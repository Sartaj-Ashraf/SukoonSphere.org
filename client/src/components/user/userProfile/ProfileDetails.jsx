import { useUser } from "@/context/UserContext";
import { ProfileNavigationLinks } from "@/utils/SharedComp/ProfileNavigationLinks";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import RenderProfileLinks from "./RenderProfileLinks";

const ProfileDetails = ({ user }) => {

  return (
    <>
      <div className="flex gap-2 sm:gap-4 items-center justify-start flex-wrap p-2 sm:p-4">
        {user?.role === "contributor" && (
          <NavLink
            to="/contributor/articles"
            className={({ isActive }) =>
              `relative text-xs md:text-sm transition-all duration-300 ease-out px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg
        ${isActive
                ? "text-[var(--ternery)] font-extrabold bg-gradient-to-r from-[var(--ternery)]/8 to-[var(--ternery)]/10 shadow-md backdrop-blur-sm rounded-xl"
                : "text-[var(--primary)] font-bold hover:text-[var(--ternery)] overflow-hidden before:absolute before:inset-0 before:translate-y-full hover:before:translate-y-0 before:bg-[var(--ternery)]/5 before:transition-transform before:duration-300 before:rounded-lg after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-[var(--ternery)] after:transition-all after:duration-300 hover:after:w-1/2 hover:after:-translate-x-1/2"
              }
        flex items-center  justify-center`
            }
          >
            Articles
          </NavLink>
        )}

        <RenderProfileLinks name="Post" link="." />
        <RenderProfileLinks name="Questions" link={`/about/user/${user._id}/questions`} />
        <RenderProfileLinks name="Answers" link={`/about/user/${user._id}/answers`} />
        <RenderProfileLinks name="Followers" link={`/about/user/${user._id}/followers`} />
        <RenderProfileLinks name="Following" link={`/about/user/${user._id}/following`} />
      </div>
      <div className="mt-4">
        <Outlet context={user} />
      </div>
    </>
  );
};

export default ProfileDetails;
