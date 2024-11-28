import React from "react";
import { Link } from "react-router-dom";
import { articles } from "@/utils/Articles";

const TrendingArticles = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Recent Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h2>
            <Link
              to={`/articles/article/${article._id}`}
              className="text-blue-500 hover:underline"
            >
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingArticles;
