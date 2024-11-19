import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import { UserAnswers } from '@/components';
import { userFollowersLoader } from '@/components/user/userProfile/UserFollowers';
import { userFollowingLoader } from '@/components/user/userProfile/UserFollowing';
import Articles from '@/pages/contributors/Articles';
const ProfessionalsProfile = lazy(() => import('../pages/professionalProfile/ProfessionalsProfile'));
const UserProfile = lazy(() => import('../pages/about/UserProfile'));
const UserPosts = lazy(() => import('../components/user/userProfile/UserPosts'));
const UserQuestions = lazy(() => import('../components/user/userProfile/UserQuestion'));
const UserFollowers = lazy(() => import('../components/user/userProfile/UserFollowers'));
const UserFollowing = lazy(() => import('../components/user/userProfile/UserFollowing'));

export const userRoutes = [
    {
        path: '/user-profile/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <ProfessionalsProfile />
            </Suspense>
        ),
    },
    // Users Routes
    {
        path: 'about/user',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <UserProfile />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserPosts />
                    </Suspense>
                ),
            },
            {
                path: 'questions',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserQuestions />
                    </Suspense>
                ),
            },
            {
                path: 'answers',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserAnswers />
                    </Suspense>
                ),
            },
            {
                path: 'followers',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserFollowers />
                    </Suspense>
                ),
                loader: userFollowersLoader
            },
            {
                path: 'following',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserFollowing />
                    </Suspense>
                ),
                loader: userFollowingLoader
            },
        ],
    },

    {
        path: 'contributor/',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <UserProfile />
            </Suspense>
        ),
        children: [
            {
                path: 'articles',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <Articles />
                    </Suspense>
                ),
            },

        ],
    },
];
