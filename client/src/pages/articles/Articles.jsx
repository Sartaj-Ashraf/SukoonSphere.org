import customFetch from '@/utils/customFetch';
import React, { useEffect, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
        <p className="text-xl font-medium">No articles found</p>
        <p className="mt-2 text-gray-500">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-5xl font-extrabold font-[Recoleta] mb-8 text-center lg:text-start bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent">
      Articles
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          to={`/articles/article/${article?._id}`}
          key={article?._id}
          className="block group"
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="p-6">
              <div className="article-cover-preview h-56 overflow-hidden mb-6 rounded-xl border border-gray-100">
                <div
                  className="prose max-w-none scale-50 origin-top"
                  dangerouslySetInnerHTML={{ __html: article?.coverPage }}
                />
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[var(--secondary-hover)] transition-colors">
                {article?.title || 'Untitled Article'}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="font-medium">
                  By {article?.author?.name}
                </span>
                <span className="text-gray-400">
                  {new Date(article?.timestamp).toLocaleDateString()}
                </span>
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