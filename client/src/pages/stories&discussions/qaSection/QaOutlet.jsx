import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import QuestionCard from "./components/QuestionCard";
import QaFilter from '@/components/qa/QaFilter';
import { Spinner } from '@/components';
import customFetch from '@/utils/customFetch';

const QaOutlet = () => {
  const { ref, inView } = useInView();
  const [activeFilter, setActiveFilter] = useState('newest');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['questions', activeFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await customFetch.get(`/qa-section?page=${pageParam}&limit=10&sortBy=${activeFilter}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000,
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
    <div>
      {/* Filter Component */}
      <QaFilter 
        activeFilter={activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Questions List */}
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
    </div>
  );
}

export default QaOutlet;