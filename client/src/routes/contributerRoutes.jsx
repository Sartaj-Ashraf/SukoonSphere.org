import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import RequestToContribute from '@/pages/contributors/RequestToContribute';

export const contributerRoutes = [
    {
        path: "/user/request-contributor",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <RequestToContribute />
            </Suspense>
        ),
    },


];
