import React from 'react';
import { AiOutlineComment, AiOutlineLike, AiOutlineFieldTime } from "react-icons/ai";
import LinkButton from '../sharedComponents/Buttons/LinkButton';

const QuizSummary = ({ data }) => {
    if (!data) return null; // Handle the case where no data is provided

    return (
        <div className="attachment-styles">
            {/* Quiz Title and Subtitle */}
            <div>
                <h1 className="text-[1.6rem] md:text-[2.5rem] sm:text-[3.5rem] sm:leading-[3.5rem] font-bold  mb-2">{data.title}</h1>
                <p className="text-[var(--black-color)] mb-4 text-semibold md:text-base lg:text-base font-bold">
                    {data.subtitle}
                </p>
            </div>

            {/* Author and Publication Details */}
            <div className="flex w-full items-center col-span-2  pb-4 justify-start gap-8">
                <div className="flex items-center col-span-2 justify-start gap-8 order-3 sm:order-none">
                    <div className="flex items-center justify-center gap-2  cursor-pointer">
                        <img
                            className="rounded-full size-7 border-2 border-gray-400"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent('Sartaj Ashraf')}&background=random`}
                            alt={data.author.name}
                        />
                        <span className="text-sm text-[var(--primary)]"> {data.author.name || "Author"}</span>
                    </div>
                    {/* <div className="flex items-center justify-center gap-2">
                        <AiOutlineFieldTime color="var(--ternery)" />
                        <span className="text-sm text-[var(--primary)]">{data.author.publishedOn || "Date"}</span>
                    </div>
                    <div className="hidden sm:flex items-center justify-between sm:justify-center gap-4">
                        <div className=" flex items-center justify-center gap-2 ">
                            <AiOutlineLike color="var(--ternery)" />
                            <span className="text-xs text-[var(--primary)]">1290</span>
                        </div>
                    </div> */}

                </div>
            </div>

            {/* Main Image and Description */}
            <div className="mb-6 overflow-hidden rounded-lg flex flex-col md:flex-col">
                <img
                    src={data.mainImage.src}
                    alt={data.mainImage.alt}
                    className="sm:w-full object-cover"
                />
                <h3 className="text-gray-900 mb-4 text-semibold md:text-base lg:text-base my-3">
                    {data.mainImage.description}
                </h3>
            </div>

            {/* Detailed Sections */}
            {Object.keys(data).filter(key => !['title', 'subtitle', 'author', 'mainImage'].includes(key)).map((key, index) => (
                <div key={index} className="attachment-section">
                    <h2 className="text-xl md:text-1xl lg:text-2xl font-bold text-[var(--black-color)] mt-6">{data[key].title}</h2>
                    <p className="text-xl md:text-base lg:text-lg font-normal text-[var(--black-color)] mb-2 ">{data[key].content}</p>
                    {data[key].quote && (
                        <blockquote className="attachment-quote">
                            {data[key].quote}
                        </blockquote>
                    )}
                    {data[key].reference && (
                        <p className="attachment-reference">Reference: {data[key].reference}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default QuizSummary;
