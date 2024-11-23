import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react';
import { FiFileText, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/shared/UserAvatar';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const response = await customFetch('articles/get-published-articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-gray-600">
        <FiFileText className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-xl font-semibold">No articles found</p>
        <p className="text-gray-500">Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-8">Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link 
            key={article._id} 
            to={`/articles/article/${article._id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              {/* Header with UserAvatar */}
              <div className="flex items-center justify-between mb-4">
                <UserAvatar
                  createdBy={article?.author?._id}
                  username={article?.author?.name}
                  userAvatar={article?.author?.avatar}
                  createdAt={article?.createdAt}
                  size="small"
                />
              </div>


              
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                {article?.title}
              </h2>
              
              {/* Footer with Views */}
              <div className="flex items-center justify-end text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FiEye className="w-4 h-4" />
                  <span>{article?.views || 0} views</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Articles;