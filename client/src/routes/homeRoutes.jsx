import React, { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Home"));
const QaSection = lazy(() => import("../pages/QaSection/QaSection"));
const Articles = lazy(() => import("../pages/articles/Articles"));
const Posts = lazy(() => import("../pages/posts/Posts"));
const Answer = lazy(() => import("../pages/answer/Answer"));
const Article = lazy(() => import("../pages/articles/Article"));

// Keep the loader as 
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { questionsAction, questionsLoader } from "@/pages/QaSection/QaSection";
import { answerAction, answersLoader } from "@/pages/answer/Answer";
import AllPosts, {
  allPostsLoader,
} from "@/pages/posts/AllPosts";
import SinglePost, { singlePostLoader } from "@/pages/posts/SinglePost";
import CommentsOutlet from "@/pages/posts/CommentsOutlet";
import RepliesOutlet from "@/pages/posts/RepliesOutlet";
import QaOutlet from "@/pages/QaSection/QaOutlet";
import AllQuestionAnswers from "@/pages/QaSection/AllQuestionAnswers";
import SingleAnswerOutlet, { SingleAnswerOutletloader } from "@/pages/QaSection/SingleAnswerOutlet";
import QaCommentOutlet from "@/pages/QaSection/QaCommentOutlet";
import QaRepliesOutlet from "@/pages/QaSection/QaRepliesOutlet";

export const homeRoutes = [
  {
    index: true,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/QA-section",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <QaSection />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <QaOutlet />,
      },
      {
        path: "/QA-section/question/:id",
        element: <AllQuestionAnswers />,
      },
      {
        path: "/QA-section/question/answer/:id/comments",
        element: <SingleAnswerOutlet />,
        children: [
          {
            index: true,
            element: <QaCommentOutlet />,
          },
          {
            path: "/QA-section/question/answer/:id/comments/:commentId/reply",
            element: <QaRepliesOutlet />,
          },
        ],
        loader: SingleAnswerOutletloader,
      },
    ],
    action: questionsAction,
    loader: questionsLoader,
  },

  {
    path: "/answer",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Answer />
      </Suspense>
    ),
    loader: answersLoader,
    action: answerAction,
  },
  {
    path: "/articles",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Articles />
      </Suspense>
    ),
  },
  {
    path: "/articles/article/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Article />
      </Suspense>
    ),
  },
  {
    path: "/posts",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Posts />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AllPosts />
          </Suspense>
        ),
        loader: allPostsLoader,      },
      {
        path: "/posts/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SinglePost />
          </Suspense>
        ),
        loader: singlePostLoader,
        children: [
          {
            index: true,
            element: <CommentsOutlet />,
          },
          {
            path: "/posts/:id/comment-id/:commentId",
            element: (
              <Suspense key={location.key} fallback={<LoadingSpinner />}>
                <RepliesOutlet />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
