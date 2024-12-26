import LoadingSpinner from "@/components/loaders/LoadingSpinner";

import { lazy, Suspense } from "react";
// Utility function to create optimized component with fallback
export const createOptimizedComponent = (importFn) => {
  const LazyComponent = lazy(importFn);

  return (props) => (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export { default as Header } from "./shared/Header";
export { default as Footer } from "./shared/Footer";
export const LightLoader = createOptimizedComponent(
  () => import("./loaders/LightLoader")
);
export const Like = createOptimizedComponent(() => import("./shared/Like"));
export const Follow = createOptimizedComponent(() => import("./shared/Follow"));
export const Spinner = createOptimizedComponent(
  () => import("./shared/Spinner")
);
export const PageIntro = createOptimizedComponent(
  () => import("./shared/PageIntro")
);

// Home Components
export const TopIntro = createOptimizedComponent(
  () => import("./homeComponents/TopIntro")
);
export const Infography = createOptimizedComponent(
  () => import("./homeComponents/Infography")
);
export const DisorderTags = createOptimizedComponent(
  () => import("./homeComponents/DisorderTags")
);
export const OurTeam = createOptimizedComponent(
  () => import("./homeComponents/OurTeam")
);
export const TrendingArticles = createOptimizedComponent(
  () => import("./homeComponents/TrendingArticles")
);
export const OurStory = createOptimizedComponent(
  () => import("./homeComponents/OurStory")
);
export const TodaysQuiz = createOptimizedComponent(
  () => import("./homeComponents/TodaysQuiz")
);
export const TodaysQuote = createOptimizedComponent(
  () => import("./homeComponents/TodaysQuote")
);
export const CampusPartners = createOptimizedComponent(
  () => import("./homeComponents/CampusPartners")
);
// Professional Profile Components

export const Intro = createOptimizedComponent(
  () => import("./professinalProfileComponents/Intro")
);
export const ProfileDetail = createOptimizedComponent(
  () => import("./professinalProfileComponents/ProfileDetail")
);

// Article Components

export const Article = createOptimizedComponent(
  () => import("./articleComponents/Article")
);
export const Search = createOptimizedComponent(
  () => import("./articleComponents/search")
);
export const SimilarArticles = createOptimizedComponent(
  () => import("./articleComponents/SimilarArticles")
);
export const SidebarArticles = createOptimizedComponent(
  () => import("./articleComponents/SidebarArticles")
);
export const SideBarArticle = createOptimizedComponent(
  () => import("./articleComponents/SideBarArticle")
);
export const Spotlight = createOptimizedComponent(
  () => import("./articleComponents/Spotlight")
);

// Post Components

export const PostModal = createOptimizedComponent(
  () => import("./posts/PostModel")
);

// Quiz Components

export const QuizList = createOptimizedComponent(
  () => import("./quizPageComponents/allQuizzesComponents/QuizList")
);
export const FilterQuizByCatagory = createOptimizedComponent(
  () =>
    import("./quizPageComponents/allQuizzesComponents/FilterQuizzesByCatagory")
);

// QA Section Components
export const QuestionModal = createOptimizedComponent(
  () => import("./qaSectionsComponents/QuestionModal")
);

// User Profile Components

export const ProfileCard = createOptimizedComponent(
  () => import("./user/userProfile/ProfileCard")
);
export const ProfileDetails = createOptimizedComponent(
  () => import("./user/userProfile/ProfileDetails")
);
export const UserPosts = createOptimizedComponent(
  () => import("./user/userProfile/UserPosts")
);
export const UserAnswers = createOptimizedComponent(
  () => import("./user/userProfile/UserAnswers")
);
export const UserQuestions = createOptimizedComponent(
  () => import("./user/userProfile/UserQuestion")
);
export const UserFollowers = createOptimizedComponent(
  () => import("./user/userProfile/UserFollowers")
);
export const UserFollowing = createOptimizedComponent(
  () => import("./user/userProfile/UserFollowing")
);

// Media Library
export const YoutubeEmbed = createOptimizedComponent(
  () => import("./mediaLibrary/videos/YoutubeEmbed")
);
