import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react';
import { FiFileText, FiEye, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/shared/UserAvatar';
import { formatDistanceToNow } from "date-fns";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchArticles = async (search = '') => {
    try {
      setLoading(true);
      const response = await customFetch(`articles/get-published-articles${search ? `?search=${search}` : ''}`);
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear existing timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Set new timeout for debouncing
    const timeout = setTimeout(() => {
      fetchArticles(query);
    }, 500);
    
    setSearchTimeout(timeout);
  };
  console.log({articles})

  useEffect(() => {
    fetchArticles();
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>

      {/* Articles Count */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Articles <span className="text-blue-500 ml-2">{articles.length}</span>
        </h2>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery ? 'No matching articles found' : 'No articles yet'}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery 
              ? 'Try searching with different keywords'
              : 'Be the first to contribute!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link 
              key={article._id} 
              to={`/articles/article/${article._id}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header with UserAvatar */}
                <div className="flex items-center justify-between mb-4">
                  <UserAvatar
                    createdBy={article?.author?._id}
                    username={article?.author?.name}
                    userAvatar={article?.author?.avatar}
                    createdAt={article?.createdAt}
                    size="medium"
                  />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
                  {article?.title}
                </h2>
                
                {/* Footer with Views */}
                <div className="flex items-center justify-end text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiEye className="w-4 h-4" />
                    <span>{article?.views.length || 0} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;