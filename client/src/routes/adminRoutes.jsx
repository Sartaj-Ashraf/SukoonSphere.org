// import React, { Suspense } from 'react';
// import LoadingSpinner from '@/components/loaders/LoadingSpinner';
// import CampaignArticles from '@/pages/dashboards/components/admin/articles/CampaignArticles';
// import Statistics from '@/pages/dashboards/components/admin/Statistics';
// import { AddArticles, ViewAllPosts } from '@/pages';

// export const adminRoutes = [
//     {
//         path: "home",
//         index: true,
//         element: (
//             <Suspense fallback={<LoadingSpinner />}>
//                 <Statistics />
//             </Suspense>
//         ),
//     },
//     {
//         path: "articles",
//         element: (
//             <Suspense fallback={<LoadingSpinner />}>
//                 <CampaignArticles />
//             </Suspense>
//         ),
//     },
//     {
//         path: "add-articles",
//         element: (
//             <Suspense fallback={<LoadingSpinner />}>
//                 <AddArticles />
//             </Suspense>
//         ),
//     },
//     {
//         path: "view-all-posts",
//         element: (
//             <Suspense fallback={<LoadingSpinner />}>
//                 <ViewAllPosts />
//             </Suspense>
//         ),
//     },
// ];
