import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import QuestionCard from "./components/QuestionCard";
import { Spinner } from '@/components';
import customFetch from '@/utils/customFetch';

const QaOutlet = () => {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['questions'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(`/qa-section?page=${pageParam}&limit=10`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allQuestions = data?.pages.flatMap(page => page.questions) || [];

  if (status === 'loading') {
    return <div className="text-center py-4"><Spinner /></div>;
  }

  if (status === 'error') {
    return <div className="text-center text-red-500 py-4">Error loading questions</div>;
  }

  if (!allQuestions?.length) {
    return (
      <div className="text-center py-8 bg-white rounded-lg">
        <p className="text-[var(--primary-color)]">
          No questions available! Start asking questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allQuestions.map((question, index) => (
        <QuestionCard
          key={`${question._id}-${index}`}
          question={question}
        />
      ))}
      
      {/* Loading indicator */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNextPage && (
          <div className="text-gray-500"><Spinner /></div>
        )}
        {!isFetchingNextPage && hasNextPage && (
          <div className="text-gray-400">Scroll for more</div>
        )}
      </div>
    </div>
  );
}

export default QaOutlet;