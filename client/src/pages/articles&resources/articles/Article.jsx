import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import {
  FaSpinner,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { LuTableOfContents } from "react-icons/lu";
import "./Article.css";
import { FaArrowTrendDown } from "react-icons/fa6";

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [toc, setToc] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`articles/${id}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load article. Please try again later.");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progressPercentage = Math.round(
        (scrollPosition / totalHeight) * 100
      );
      setProgress(progressPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(".article-body h1, .article-body h2")
    );
    const newToc = headings.map((heading) => ({
      text: heading.innerText,
      slug: heading.id,
    }));
    setToc(newToc);
  }, [article]);

  const cleanContent = (content) => {
    try {
      return content
        .replace(
          /<div class="flex-shrink-0 flex flex-col relative items-end">[\s\S]*?<div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">/,
          ""
        )
        .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>$/, "")
        .trim();
    } catch (err) {
      console.error("Error cleaning content:", err);
      return content;
    }
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
          <p className="text-lg font-medium mb-2">Article Not Found</p>
          <p>
            The article you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(article.content);

  return (
    <div className="relative bg-[var(--white-color)] grid grid-cols-12 gap-8">
      <article className="article-content col-span-8">
        <header className=" relative article-header space-y-6">
          <div className="meta-item flex items-center justify-center gap-2 ">
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUser className="meta-icon" />
            )}
            <span>{article.authorName || "Anonymous"}</span>
          </div>
          <h2 className=" md:text-[1.75rem] font-bold sm:leading-[2.5rem] text-var(--primary)">
            {article.title}
          </h2>
          <div className="article-meta flex items-center justify-center">
            <div className="meta-separator" />
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="meta-separator" />
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          <div className="article-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div
          className="article-body prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanContent(article.content) }}
        />

        <footer className="article-footer">
          <div className="article-tags">
            {article.tags &&
              article.tags.map((tag, index) => (
                <span key={index} className="article-tag">
                  {tag}
                </span>
              ))}
          </div>
        </footer>
      </article>
      <section className="sticky top-40 col-span-4 mt-8 shadow-sm p-4 fit-content">
        <h2 className="text-2xl font-bold mb-4 flex gap-3 items-center">
          {" "}
          <LuTableOfContents />
          Dive straight to:
        </h2>
        <ol className="pl-8 list-disc">
          {toc.map((item, index) => (
            <li key={index} className="mb-2 flex items-center gap-2">
              <FaArrowTrendDown />

              <a
                href={`#${item.slug}`}
                className="text-gray-900 hover:text-[var(--ternery)] hover:underline transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.slug);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Article;
