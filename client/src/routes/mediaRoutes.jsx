import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';

// Lazy load each page component
const AllQuizzes = lazy(() => import('../pages/articles&resources/quiz/AllQuizzes'));
const Quiz = lazy(() => import('../pages/articles&resources/quiz/Quiz'));
// Import loaders as usual
import { AllQuizzesLoader } from '@/loaders/AllQuizzesLoader';
import { QuizDetailsLoader } from '@/loaders/QuizDetailsLoader';
import SingleVideos from '@/pages/mediaLibrary/videos/SingleVideos';
import { singleVideosLoader } from '@/loaders/singleVideosLoader';
import Video from '@/pages/mediaLibrary/videos/Video';
import PlaylistVideos from '@/pages/mediaLibrary/videos/PlaylistVideos';
import { playlistVideosLoader } from '@/loaders/playlistVideosLoader';
import AllVideos from '@/pages/mediaLibrary/videos/AllVideos';
import { PodcastHome } from '@/pages';
import AllPodcasts from '@/pages/mediaLibrary/podcasts/AllPodcasts';
import PodcastEpisodes from '@/pages/mediaLibrary/podcasts/PodcastEpisodes';
import SingleEpisode from '@/pages/mediaLibrary/podcasts/SingleEpisode';

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
                element: <SingleVideos />,
                loader: singleVideosLoader
            },
            {
                path: 'playlists',
                element: <PlaylistVideos />,
                loader: playlistVideosLoader
            },
        ],

    },
    {
        path: '/all-videos/video/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Video />
            </Suspense>
        ),
    },

    {
        path: '/podcasts',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <PodcastHome />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: <AllPodcasts />,
                loader: async () => {
                    // Add your loader logic here
                    return { podcasts: [
                        {
                            id: 1,
                            title: 'Podcast 1',
                            description: 'Description of Podcast 1',
                            image: 'https://example.com/podcast1.jpg',
                            episodes: [
                                {
                                    id: 1,
                                    title: 'Episode 1',
                                    description: 'Description of Episode 1',
                                    audio: 'https://example.com/episode1.mp3',
                                },
                                {
                                    id: 2,
                                    title: 'Episode 2',
                                    description: 'Description of Episode 2',
                                    audio: 'https://example.com/episode2.mp3',
                                },
                            ],
                        },
                        {
                            id: 1,
                            title: 'Podcast 1',
                            description: 'Description of Podcast 1',
                            image: 'https://example.com/podcast1.jpg',
                            episodes: [
                                {
                                    id: 1,
                                    title: 'Episode 1',
                                    description: 'Description of Episode 1',
                                    audio: 'https://example.com/episode1.mp3',
                                },
                                {
                                    id: 2,
                                    title: 'Episode 2',
                                    description: 'Description of Episode 2',
                                    audio: 'https://example.com/episode2.mp3',
                                },
                            ],
                        },
                    ] };
                },
            },
            {
                path: 'episodes/:podcastId',
                element: <PodcastEpisodes />,
                loader: async ({ params }) => {
                    // Add your loader logic here
                    return {
                        podcast: {
                            id: 1,
                            title: 'Podcast 1',
                            description: 'Description of Podcast 1',
                            image: 'https://example.com/podcast1.jpg',
                            host: {
                                id: 1,
                                name: 'Host 1',
                                avatar: 'https://example.com/host1.jpg',
                            },
                        },
                        episodes: []
                    };
                },
            },
            {
                path: 'episode/:episodeId',
                element: <SingleEpisode />,
                loader: async ({ params }) => {
                    // Add your loader logic here
                    return {
                        episode: {},
                        podcast: {}
                    };
                },
            },
        ],
    },
];
