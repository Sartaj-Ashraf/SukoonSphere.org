import React, { useEffect, useState } from "react";
import HTMLFlipBook from 'react-pageflip';
import customFetch from "@/utils/customFetch";
import { Link, useParams } from "react-router-dom";

const Article = () => {
  const [article, setArticle] = useState(null);
  const { id: paramId } = useParams();
  const fetchArticles = async () => {
    try {
      const { data } = await customFetch(
        `articles/get-article-with-pages/${paramId}`
      );
      setArticle(data.article);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, [])

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8 md:mx-8 sm:mx-0 sm:my-0">
      <HTMLFlipBook
        width={window.innerWidth < 640 ? window.innerWidth - 32 : window.innerWidth - 128}
        height={window.innerWidth < 640 ? window.innerHeight - 64 : window.innerHeight}
        className="w-full h-full mx-auto my-4 sm:my-0"
      >
        <div className="demoPage p-4 sm:p-8 bg-white shadow-lg overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: article.coverPage }} />
        </div>

        {article.pages.map((page) => (
          <div key={page._id} className="demoPage p-4 sm:p-8 bg-white shadow-lg overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: page.pageContent }} />
          </div>
        ))}

      </HTMLFlipBook>
    </div>
  );
};

export default Article;
