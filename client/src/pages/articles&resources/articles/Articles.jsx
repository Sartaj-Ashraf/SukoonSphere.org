import { useEffect, useState } from 'react';
import customFetch from '@/utils/customFetch';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaCalendarAlt, FaUser, FaSpinner } from 'react-icons/fa';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await customFetch.get('articles');
        setArticles(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-[var(--grey--600)] text-lg">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--grey--900)] mb-4">
          Articles & Resources
        </h1>
        <p className="text-[var(--grey--600)] max-w-2xl mx-auto">
          Explore our collection of articles written by mental health professionals and experts. 
          Find valuable insights, tips, and information about mental health and well-being.
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FaBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-[var(--grey--600)] text-lg mb-4">
            No articles available at the moment
          </p>
          <p className="text-[var(--grey--500)]">
            Please check back later for new content
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article._id}
              to={`/articles/article/${article._id}`}
              className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Article Preview Image */}
              <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBookOpen className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-200" />
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
                    <FaUser className="w-4 h-4 mr-2" />
                    <span>{article.createdBy?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    <span>{new Date(article.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
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