import React from "react";
import { Link } from "react-router-dom";

const HeaderImg = ({ currentPage, bgImg, className = " h-[25vh] md:h-[35vh]", ...props }) => {
  return (
    <div
      className={`bg-contain bg-[position-y:30rem] mb-8 flex flex-col items-center justify-center md:bg md:bg-center bg-fixed object-bottom ${className} `}
      {...props}
      style={{
        backgroundImage: `linear-gradient(rgb(24 32 112 / 70%), rgb(0 9 103 / 70%)) ,url(${bgImg})`,
      }}
    >
      <div className="flex flex-col items-center gap-3 mb-[-4%]">
        <Link
          className="text-4xl lg:text-[2.5rem] font-bold text-white uppercase"
          to="."
        >
          {currentPage}
        </Link>
        <div className="flex items-center">
          <Link
            className="font-semibold text-white uppercase text-sm lg:text-lg"
            to="/"
          >
            HOME
          </Link>
          <span className="px-4 text-primary text-xs lg:text-base">/</span>
          <Link to="." className="text-white text-xs lg:text-base uppercase">
            {currentPage}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderImg;
