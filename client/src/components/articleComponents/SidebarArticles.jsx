import { articles } from "@/utils/Articles";
import { Link } from "react-router-dom";
import { SideBarArticle } from "..";
import { TbTrendingUp3 } from "react-icons/tb";

const SidebarArticles = () => {
  return (
    <div className="">
      <div className="flex items-center gap-x-2 mb-6">
        <TbTrendingUp3 className="size-6" />
        <h4 className="text-2xl">trending</h4>
      </div>
      <div className="grid gap-4 px-4 border-l">
        {articles.slice(0, 3).map((article, index) => {
          return <SideBarArticle key={index} article={article} />;
        })}
      </div>
    </div>
  );
};

export default SidebarArticles;
