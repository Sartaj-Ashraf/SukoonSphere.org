import React from "react";
import SectionTitle from "../sharedComponents/SectionTitle";
import { FaRegCirclePlay } from "react-icons/fa6";
import { podcastsLists } from "@/utils/podcastsLists";
import MiniCard from "../sharedComponents/MiniCard";
import { Link } from "react-router-dom";
function Podcasts() {
  return (
<>
      <SectionTitle title="Recent Podcasts" />
    <div className='max-w-7xl mx-auto px-4 ' data-aos="fade-up">
      <div className="space-y-4 ">
        <h2 className="text-3xl mt-0 text-[var(--black-color)]">Our Latest Podcast</h2>
        <hr className="border-t-2 border-gray-400" />
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4 rounded-md bg-[var(--primary)] text-white flex flex-col gap-4 p-4">
            <img
              className="h-96 object-contain"
              src="https://img.freepik.com/free-vector/gradient-podcast-cover-template_23-2149449551.jpg"
              alt=""
            />
            <div className="flex gap-3 items-center">
              <h2 className="text-xl font-bold text-[var(--white-color)] ">
                Suneeta Prajapati: The Joys of Reporting Crime
              </h2>
              <Link to={"/podcast-page"}>
                <FaRegCirclePlay className="text-[var(--ternery)] hover:rounded-full text-4xl" />
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-2 items-center">
            <h2 className="text-3xl text-[var(--black-color)] my-4">Podcast Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 mb-4" data-aos="zoom-in">
              {podcastsLists.slice(0, 3).map((podcastsList, index) => (
                <MiniCard key={index} podcastsList={podcastsList} />
              ))}
            </div>
            <div className="">
              <Link to={"podcast/playlists"}>
                <button className="btn-1">Explore more</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
</>
  );
}

export default Podcasts;
