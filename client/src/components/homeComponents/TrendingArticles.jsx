import React from "react";

import SectionTitle from "../sharedComponents/SectionTitle";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { articles } from "@/utils/Articles";
import MiniArticle from "./MiniArticle";

const  TrendingAricles =()=> {
const SpotlightArticle = articles.reduce((max, article) => {
  return article.views > max.views ? article : max;
}, articles[0])

  return (
    <div className="max-w-7xl mx-auto ">
      <SectionTitle title="Recent Artcles" />
      <div className="space-y-4">
        <div className="flex justify-center items-center  lg:justify-end mr-9">
          <h2 className=" text-3xl mt-1 text-[var(--black-color)] inline">
            Spotlight
          </h2>
        </div>
        <div className="flex flex-col-reverse items-center lg:flex-row gap-4 px-4 lg:items-start">
          <div className=" flex flex-col gap-2 items-center">
            <h2 className="text-3xl text-[var(--black-color)] mb-4">Recents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 " data-aos="fade-up">
              {articles.slice(0, 3).map((article, index) => (
                <MiniArticle key={index} article={article} />
              ))}
            </div>
          </div>
          
          <div className="rounded-md bg-[var(--blue-color)] text-white flex flex-col gap-4"  data-aos="fade-left">
            <img
              className="h-96 object-cover"
              src={SpotlightArticle.image}
              alt="image"
            />
            <div className="flex gap-3 items-center">
              <h2 className="text-xl font-bold text-[var(--primary)] ">
                {SpotlightArticle.title}
              </h2>
              <Link to={"/podcast-page"}>
                <IoIosArrowRoundForward className="text-[var(--primary)] text-4xl transition-transform duration-300 ease-in-out hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrendingAricles;
