import React from "react";
import { Link } from "react-router-dom";

function MiniCard({ article }) {
  return (
    <Link to={`/articles/article/${article._id}`} className="block">
      <div className="border-[1px] rounded-[10px] h-[400px] shadow-lg hover:-translate-y-3.5 hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-4">
        <div className="h-60 overflow-hidden">
          <div
            className="prose max-w-none scale-50 origin-top h-full"
            dangerouslySetInnerHTML={{ __html: article.coverPage }}
          />
        </div>
        <div className="flex flex-col gap-2 text-black px-3 py-3 transition ease-in-out">
          <h4 className="text-xl font-bold text-[#13404f] line-clamp-2 hover:text-[var(--ternery)] cursor-pointer">
            {article.title || 'Untitled Article'}
          </h4>
          <p className="text-gray-600">By {article.author.name}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {new Date(article.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MiniCard;
