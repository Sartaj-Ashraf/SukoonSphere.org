
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import notFoundBySearch from "../../assets/images/notFoundBySearch.jpg";
import { PodcastCard } from "@/components";
import { podcastsLists } from "../../utils/podcastsLists";
import bgImg from "../../assets/images/bg_podcast.jpg";
import SimilarPodcasts from "@/components/podcastComponents/SimilarPodcasts";
const PodcastEpisodes = () => {
  const { id: paramsId } = useParams()
  const podcastList = podcastsLists.find(podcast => podcast.podcastListId === paramsId)
  console.log({ paramsId })
  console.log({ podcastList })

  // console.log(podcastsLists[0].podcasts)
  return (
    <>
      <div className="md:px-7 ">
        <div className=" gap-4 mt-6">
          {/* Articles */}
          <div className="  gap-5 ">
            <h1 className="flex-start text-[var(--blue-color)] font-bold text-5xl">
              Podcast Episodes
            </h1>
            {podcastList.podcasts.length > 0 ? (
              podcastList.podcasts.map((podcast) => {
                return (
                  <PodcastCard key={podcast.podcastId} podcast={podcast} />
                );
              })
            ) : (
              <div>
                <p className="pt-4">
                  no podcast found ! Please try searching for different keywords
                  or adjusting your filters
                </p>
                <img
                  src={notFoundBySearch}
                  alt="image"
                  className="h-[200px] md:h-[50vh]"
                />
              </div>
            )}
          </div>
          {/* Search filters */}


        </div>
      </div>
    </>
  );
};

export default PodcastEpisodes;
