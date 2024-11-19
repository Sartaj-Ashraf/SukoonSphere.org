import { HeaderImg } from "@/components";
import React from "react";
import { podcastsLists } from "../../utils/podcastsLists";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { MdOutlineDateRange } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import MiniCard from "@/components/sharedComponents/MiniCard";
function PodcastPage() {
 
  const {id:paramsId} = useParams()
  const podcastList = podcastsLists[0].podcasts.find(podcast => podcast.podcastId === Number(paramsId))
  console.log({podcastList})
  console.log({paramsId})
  

  const {
    episodeNo,
    title,
    avatar,
    author,
    publishDate,
    image,
    description,
    audioSource,
    full_discription
  } = podcastList;
// console.log()
  return (
    <>
    <section className="container px-40 flex flex-col gap-6">
      <span>Episode: {episodeNo}</span>
      <div>
        <h2 className="text-4xl text-[var(--black-color)] font-[var(--black-color)] my-3">
          {title}
        </h2>
        {/* Author information */}
        <div className="flex flex-col gap-4">
          <span className="flex items-center">
            <img
              src={avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt={author}
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-semibold">{author}</span>
          </span>
          <span className="text-xs place-items-center font-mono text-[var(--blue-color)] font-bold">
            Date: {publishDate}
          </span>
        </div>
      </div>
      <div className="flex flex-col text-black border-b-[1px] border-gray-300 p-4 gap-4">
        <div className="flex gap-4">
          <img src={image} alt="" className="w-52" />
          <p className="text-xl">{description}</p>
        </div>
        <audio controls className="w-3/4 h-8 my-3 ml-3">
          <source src={audioSource} type="audio/ogg" />
          <source src={audioSource} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <h2 className="text-xl text-[var(--blue-color)]">Description:</h2>
      <p className="text-xl text-gray-700 border-b-[1px] border-gray-300 pb-3">
        {full_discription}
      </p>
      <div className="text-2xl flex flex-col gap-6 text-black">
        <p>New episode every fortnight</p>
        <p>Explore more on www.sukoonsphere.com</p>
        <p><span>Produced by:</span> {author}</p>
      </div>
        <div className="grid grid-cols-3 gap-4 ">
        {podcastsLists.slice(0, 3).map((podcastsList, index) => (
                <MiniCard key={index} podcastsList={podcastsList} />
              ))}
          {/* <div className="cardBody border-[1px]  h-[350px]  rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-4">
            <img className="w-full h-44 object-cover  " src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvbBDDTAMW03jEFb3idqjkuI0vOBsh6PtmA35FHoPA9FaGbLabP6xHxs74KrFUvRNlA6M&usqp=CAU' alt="" />
            <div className="flex flex-col gap-2 text-black px-6 py-3  transition ease-in-out ">
              <h4 className="text-3xl text-[var(--blue-color)] font-semibold border-b-[1px] border-gray-200">
                Akele Aur Chalna Chahiye
              </h4>
              <div className="flex justify-between">
                <p className="flex  items-center gap-2 a">
                  <MdOutlineDateRange className="text-xl text-[var(--blue-color)] " />
                  <span className="text-xs text-gray-400"> {publishDate}</span>
                </p>
                <Link>
                  <FaArrowRight className="border-2 border-[var(--blue-color)] text-[var(--blue-color)] hover:bg-[var(--blue-color)] transition-all duration-300 ease-in-out hover:text-white rounded-full w-10 h-4 py-[2px]" />
                </Link>
              </div>
            </div>
          </div>
          <div className="cardBody border-[1px]  h-[350px] rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-4">
            <img className="w-full h-44 object-cover  " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpoTf_27bVZoUmhZ4wtS-qNwz-PV_00WpVQA&s" alt="" />
            <div className="flex flex-col gap-2 text-black px-6 py-3  transition ease-in-out ">
              <h4 className="text-3xl text-[var(--blue-color)] font-semibold border-b-[1px] border-gray-200">
                Akele Aur Chalna Chahiye
              </h4>
              <div className="flex justify-between">
                <p className="flex  items-center gap-2 a">
                  <MdOutlineDateRange className="text-xl text-[var(--blue-color)] " />
                  <span className="text-xs text-gray-400"> {publishDate}</span>
                </p>
                <Link>
                  <FaArrowRight className="border-2 border-[var(--blue-color)] text-[var(--blue-color)] hover:bg-[var(--blue-color)] transition-all duration-300 ease-in-out hover:text-white rounded-full w-10 h-4 py-[2px]" />
                </Link>
              </div>
            </div>
          </div>
          <div className="cardBody border-[1px] h-[350px] rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-4">
            <img className="w-full h-44 object-cover " src={image} alt="" />
            <div className="flex flex-col gap-2 text-black px-6 py-3  transition ease-in-out ">
              <h4 className="text-3xl text-[var(--blue-color)] font-semibold border-b-[1px] border-gray-200">
                Akele Aur Chalna Chahiye
              </h4>
              <div className="flex justify-between">
                <p className="flex  items-center gap-2 a">
                  <MdOutlineDateRange className="text-xl text-[var(--blue-color)] " />
                  <span className="text-xs text-gray-400"> {publishDate}</span>
                </p>
                <Link>
                  <FaArrowRight className="border-2 border-[var(--blue-color)] text-[var(--blue-color)] hover:bg-[var(--blue-color)] transition-all duration-300 ease-in-out hover:text-white rounded-full w-10 h-4 py-[2px]" />
                </Link>
              </div>
            </div>
          </div> */}

        </div>
        <div className="flex gap-3 text-[var(--blue-color)] border-2 border-[var(--blue-color)] w-24 p-2 rounded-full shadow-inner">
          <FaFacebook className="size-6 " />
          <FaTwitter className="size-6" />
          <AiFillInstagram className="size-6" />
        </div>
      </section>
    </>
  );
}

export default PodcastPage;
