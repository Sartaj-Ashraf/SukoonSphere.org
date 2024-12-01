import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';

// Lazy load each page component
const AllQuizzes = lazy(() => import('../pages/articles&resources/quiz/AllQuizzes'));
const Quiz = lazy(() => import('../pages/articles&resources/quiz/Quiz'));
// Import loaders as usual
import { AllQuizzesLoader } from '@/loaders/AllQuizzesLoader';
import { QuizDetailsLoader } from '@/loaders/QuizDetailsLoader';
import { AllVideos } from '@/pages';
import SingleVideos from '@/pages/mediaLibrary/videos/SingleVideos';
import { singleVideosLoader } from '@/loaders/singleVideosLoader';
import Video from '@/pages/mediaLibrary/videos/Video';
import PlaylistVideos from '@/pages/mediaLibrary/videos/PlaylistVideos';
import { playlistVideosLoader } from '@/loaders/playlistVideosLoader';
export const mediaRoutes = [
    {
        path: '/quiz',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Quiz />
            </Suspense>
        ),
    },

    {
        path: '/all-quizzes',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <AllQuizzes />
            </Suspense>
        ),
        loader: AllQuizzesLoader,
    },
    {
        path: '/all-quizzes/quiz/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Quiz />
            </Suspense>
        ),
        loader: QuizDetailsLoader,
    },

    {
        path: '/all-videos',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <AllVideos />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: <SingleVideos/>,
                loader:singleVideosLoader
            },
            {
                path: 'playlists',
                element: <PlaylistVideos/>,
                loader:playlistVideosLoader
            },
        ],
       
    },
    {
        path: '/all-videos/video/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Video/>
            </Suspense>
        ),
    }
];
