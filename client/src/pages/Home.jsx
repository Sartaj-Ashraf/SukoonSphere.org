import React, { Fragment, lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

// Lazy load components
const Podcasts = lazy(() => import("../components/homeComponents/Podcasts"));
const TopIntro = lazy(() => import("../components/homeComponents/TopIntro"));
const TodaysQuote = lazy(() => import("../components/homeComponents/TodaysQuote"));
const TodaysQuiz = lazy(() => import("../components/homeComponents/TodaysQuiz"));
const OurStory = lazy(() => import("../components/homeComponents/OurStory"));
const Infography = lazy(() => import("../components/homeComponents/Infography"));
const TrendingVideos = lazy(() => import("../components/homeComponents/TrendingVideos"));
const CampusPartners = lazy(() => import("../components/homeComponents/CampusPartners"));
const DisorderTags = lazy(() => import("../components/homeComponents/DisorderTags"));
const OurTeam = lazy(() => import("../components/homeComponents/OurTeam"));

const Home = () => {
  return (
    <Fragment>
      <Suspense fallback={<LoadingSpinner />}>
        <TopIntro />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <DisorderTags />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <OurStory />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <TodaysQuote />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Infography />
      </Suspense>
      {/* <Suspense fallback={<LoadingSpinner />}>
        <TrendingArticles />
      </Suspense> */}
      <Suspense fallback={<LoadingSpinner />}>
        <TodaysQuiz />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <CampusPartners />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <OurTeam />
      </Suspense>


      {/* <div className="relative opacity-50 cursor-not-allowed">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg">
            Coming Soon! 🎬
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <TrendingVideos />
        </Suspense>
      </div>

      <div className="relative opacity-50 cursor-not-allowed">
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-800 shadow-lg">
            Coming Soon! 🎙️
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <Podcasts />
        </Suspense>
      </div> */}

    </Fragment>
  );
};

export default Home;




