import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import customFetch from '@/utils/customFetch';
import { FaSpinner, FaUser, FaCalendarAlt, FaClock, FaExclamationCircle } from 'react-icons/fa';
import './Article.css';

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`articles/${id}`);
        setArticle(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load article. Please try again later.');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const cleanContent = (content) => {
    try {
      return content
        .replace(/<div class="flex-shrink-0 flex flex-col relative items-end">[\s\S]*?<div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">/, '')
        .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>$/, '')
        .trim();
    } catch (err) {
      console.error('Error cleaning content:', err);
      return content;
    }
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-[var(--grey--600)] text-lg">Loading article...</p>
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
          <p>The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(article.content);

  return (
    <div className="article-container">
      <article className="article-content">
        <header className="article-header">
          <div className="article-category">Mental Health</div>
          <h1>{article.title}</h1>
          <div className="article-meta">
            <div className="meta-item">
              <FaUser className="meta-icon" />
              <span>{article.createdBy?.name || 'Anonymous'}</span>
            </div>
            <div className="meta-separator" />
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="meta-separator" />
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </header>

        <div className="article-progress">
          <div className="progress-bar" />
        </div>

        <div 
          className="article-body prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanContent(article.content) }}
        />

        <footer className="article-footer">
          <div className="article-tags">
            {article.tags && article.tags.map((tag, index) => (
              <span key={index} className="article-tag">
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
};

export default Article;
