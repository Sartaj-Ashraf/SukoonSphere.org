import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import HowToCreateAVideo from '@/pages/userManuals/HowToCreateAVideo';
import HowToCreateAnArticle from '@/pages/userManuals/HowToCreateAnArticle';

export const userManuals = [
  {
    path: "/user-manual/create-video",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HowToCreateAVideo />
      </Suspense>
    ),
  },
  {
    path: "/user-manual/create-article",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HowToCreateAnArticle />
      </Suspense>
    ),
  },
];
