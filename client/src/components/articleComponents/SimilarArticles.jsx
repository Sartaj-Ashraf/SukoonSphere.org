import { SidebarArticles } from "..";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const SimilarArticles = ({ similarArticles }) => {
  if (!similarArticles || similarArticles.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold mb-6 text-[var(--primary)]">Similar Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {similarArticles.map((similarArticle) => (
          <Link 
            key={similarArticle._id}
            to={`/articles/article/${similarArticle._id}`}
            className="group block bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 text-[var(--primary)] group-hover:text-[var(--ternery)] transition-colors duration-200 line-clamp-2">
                {similarArticle.title}
              </h4>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <div className="flex items-center">
                  {similarArticle.authorAvatar ? (
                    <img
                      src={similarArticle.authorAvatar}
                      alt={similarArticle.authorName}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <FaUser className="w-4 h-4 mr-2" />
                  )}
                  <span>{similarArticle.authorName || "Anonymous"}</span>
                </div>
                <span className="mx-2">•</span>
                <span>
                  {new Date(similarArticle.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarArticles;