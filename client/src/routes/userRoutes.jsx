import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import { UserAnswers } from '@/components';
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
        path: 'about/user/:id',
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
                path: '/about/user/:id/questions',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserQuestions />
                    </Suspense>
                ),
            },
            {
                path: '/about/user/:id/answers',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserAnswers />
                    </Suspense>
                ),
            },
            {
                path: '/about/user/:id/followers',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserFollowers />
                    </Suspense>
                ),
            },
            {
                path: '/about/user/:id/following',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <UserFollowing />
                    </Suspense>
                ),
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
