import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import RequestToContribute from '@/pages/contributors/RequestToContribute';

export const contributerRoutes = [
    {
        path: "/user/request-contibuter",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <RequestToContribute />
            </Suspense>
        ),
    },


];
