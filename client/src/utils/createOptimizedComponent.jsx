import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import { lazy, Suspense } from 'react';
// Utility function to create optimized component with fallback
export const createOptimizedComponent = (importFn) => {
    const LazyComponent = lazy(importFn);

    return (props) => (
        <Suspense fallback={<LoadingSpinner />}>
            <LazyComponent {...props} />
        </Suspense>
    );
};