import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';

// Lazy load each page component
const AllQuizzes = lazy(() => import('../pages/quiz/AllQuizzes'));
const Quiz = lazy(() => import('../pages/quiz/Quiz'));
const PodcastPlaylists = lazy(() => import('../pages/podcast/PodcastPlaylists'));
const PodcastCard = lazy(() => import('../components/sharedComponents/PodcastCard'));
const PodcastPage = lazy(() => import('@/pages/podcast/PodcastPage'));

// Import loaders as usual
import { AllQuizzesLoader } from '@/loaders/AllQuizzesLoader';
import { QuizDetailsLoader } from '@/loaders/QuizDetailsLoader';
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
        path: '/podcast/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <PodcastCard />
            </Suspense>
        ),
    },
    {
        path: '/podcast-page/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <PodcastPage />
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
        path: 'podcast/playlists',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <PodcastPlaylists />
            </Suspense>
        ),
    },
];
