import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import RenderProfileLinks from "./RenderProfileLinks";

const ProfileDetails = ({ user }) => {

  return (
    <>
      <div className="flex gap-2 sm:gap-4 items-center justify-start flex-wrap p-1 sm:p-2">
        {user?.role === "contributor" && (
          <>
            <RenderProfileLinks name="Articles" link="articles" />
            <RenderProfileLinks name="Videos" link="videos" />
            <RenderProfileLinks name="Podcast" link="podcasts" />
          </>
        )}

        <RenderProfileLinks name="Post" link="." />
        <RenderProfileLinks name="Questions" link="questions" />
        <RenderProfileLinks name="Answers" link="answers" />
        <RenderProfileLinks name="Followers" link="followers" />
        <RenderProfileLinks name="Following" link="following" />
      </div>
      <div className="mt-4">
        <Outlet context={user} />
      </div>
    </>
  );
};

export default ProfileDetails;
