import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaUser,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { PageIntro } from "@/components";
import {
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiHeart,
} from "react-icons/fi";
import { MdMultipleStop } from "react-icons/md";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { ref, inView } = useInView();

  // Filter options
  const filterOptions = [
    {
      value: "newest",
      label: "Newest First",
      icon: <FiClock className="w-4 h-4" />,
    },
    {
      value: "oldest",
      label: "Oldest First",
      icon: <FiCalendar className="w-4 h-4" />,
    },
    {
      value: "title",
      label: "A-Z",
      icon: <MdMultipleStop className="w-4 h-4" />,
    },
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (searchInput) {
            newParams.set("search", searchInput);
          } else {
            newParams.delete("search");
          }
          return newParams;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchParams]);

  const handleFilterChange = (value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", value);
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["articles", currentFilter, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam,
        limit: 9,
        sortBy: currentFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await customFetch.get(`articles?${params}`);
      console.log("Response from articles:", response.data);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 5 * 60 * 1000,
  });

  // Reset infinite query when filter changes
  useEffect(() => {
    refetch();
  }, [currentFilter, refetch]);

  // Fetch next page when last element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-[var(--grey--600)] text-lg">Loading articles...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="text-lg font-medium mb-2">Error</p>
          <p>Failed to load articles. Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allArticles = data?.pages.flatMap((page) => page.articles) || [];
  console.log("All articles:", allArticles);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
      {/* Header Section */}
      {/* <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--grey--900)] mb-4">
          Articles & Resources
        </h1>
        <p className="text-[var(--grey--600)] max-w-2xl mx-auto">
          Explore our collection of articles written by mental health professionals and experts. 
          Find valuable insights, tips, and information about mental health and well-being.
        </p>
      </div> */}
      <PageIntro
        title="Articles"
        description="Explore our collection of articles written by mental health professionals and experts. Find valuable insights, tips, and information about mental health and well-being."
      ></PageIntro>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-[var(--white-color)] py-2 px-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.delete("search");
                  return newParams;
                });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2 md:mt-0">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-2 ${
                  currentFilter === option.value
                    ? "bg-[var(--primary)] text-white"
                    : " text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Articles Grid */}
      {allArticles.length === 0 ? (
        <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-md">
          <FaBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-[var(--grey--600)] text-lg mb-4">
            No articles found
          </p>
          <p className="text-[var(--grey--500)]">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allArticles.map((article, index) => (
              <Link
                key={`${article._id}-${index}`}
                to={`/articles/article/${article._id}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Article Preview Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaBookOpen className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold text-[var(--grey--900)] group-hover:text-blue-600 transition-colors duration-200 mb-3">
                    {article.title}
                  </h2>

                  {/* Article Metadata */}
                  <div className="flex items-center justify-between text-sm text-[var(--grey--500)] pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      {article.authorAvatar ? (
                        <img
                          src={`${article.authorAvatar}`}
                          alt=""
                          className="w-6 h-6 mr-2 object-cover rounded-full"
                        />
                      ) : (
                        <FaUser className="w-4 h-4 mr-2" />
                      )}
                      <span>{article.authorName || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Trigger */}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage ? (
                <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
              ) : (
                <div className="h-8" /> // Spacer for intersection observer
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Articles;
