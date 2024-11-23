import React, { useEffect, useState } from "react";
import CreateArticleModel from "./models/CreateArticleModel";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { FiPlus, FiCheck, FiAlertCircle, FiTrash2, FiClock, FiFile, FiEye } from "react-icons/fi";
import DeleteModal from "@/components/shared/DeleteModal";
import { Link } from "react-router-dom";

// Simplified API service with only essential operations
const articleService = {
  getPendingArticles: async () => {
    const { data } = await customFetch.get("/articles/get-pending-articles");
    return data.articles;
  },

  getPublishedArticles: async () => {
    const { data } = await customFetch.get("/articles/get-published-articles");
    return data.articles;
  },

  publishArticle: async (articleId) => {
    const { data } = await customFetch.patch(`/articles/publish-article/${articleId}`);
    return data;
  },

  deleteArticle: async (articleId) => {
    const { data } = await customFetch.delete(`/articles/delete-article/${articleId}`);
    return data;
  }
};

const Articles = () => {
  const [showModal, setShowModal] = useState(false);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [publishedArticles, setPublishedArticles] = useState([]);
  const [articleId, setArticleId] = useState(null);
  const [showDeleteArticleModal, setShowDeleteArticleModal] = useState(false);

  const fetchArticles = async () => {
    try {
      const [pending, published] = await Promise.all([
        articleService.getPendingArticles(),
        articleService.getPublishedArticles()
      ]);
      setPendingArticles(pending);
      setPublishedArticles(published);
    } catch (error) {
      toast.error("Failed to fetch articles");
    }
  };

  const handlePublishArticle = async (articleId) => {
    try {
      await articleService.publishArticle(articleId);
      toast.success("Article published successfully");
      fetchArticles();
    } catch (error) {
      toast.error("Failed to publish article");
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await articleService.deleteArticle(articleId);
      toast.success("Article deleted successfully");
      fetchArticles();
      setShowDeleteArticleModal(false);
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Articles</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Create New Article
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 pl-3">
        {pendingArticles.length > 0 && (
          <>
            <FiAlertCircle className="w-5 h-5 text-red-500" />
            <h4 className="text-lg font-medium text-red-500">
              {pendingArticles?.length} pending articles found
            </h4>
          </>
        )}
      </div>

      {pendingArticles.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-8">
          {pendingArticles.map((article) => (
            <div key={article._id} className="bg-white p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg border-l-4 border-red-500">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <FiFile className="w-5 h-5 text-red-500 shrink-0" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 break-words">
                      {article.title || "Untitled"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <FiClock className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      Created: {formatDate(article.createdAt)}
                    </span>
                  </div>
                  {article.pdfPath && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <FiFile className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        PDF File: {article.pdfPath.split('/').pop()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link 
                    className="btn-3 inline-flex items-center gap-1 px-2 py-1 text-sm " 
                    to={`/articles/article/${article._id}`}
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    Preview
                  </Link>
                  <button
                    onClick={() => handlePublishArticle(article._id)}
                    className="btn-2 inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-50 text-green-600 "
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                    Publish
                  </button>
                  <button
                    onClick={() => {
                      setArticleId(article._id);
                      setShowDeleteArticleModal(true);
                    }}
                    className="btn-red inline-flex items-center gap-1 px-2 py-1 text-sm"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {article.pages.map((page) => (
                    <div
                      key={page._id}
                      className="px-2 py-1 bg-gray-50 rounded-full text-sm text-gray-600 flex items-center gap-1.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {page.pageNumber}
                      </span>
                      <span className="text-xs">Page {page.pageNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 pl-3">
        {publishedArticles.length > 0 && (
          <>
            <FiCheck className="w-5 h-5 text-green-500" />
            <h4 className="text-lg font-medium text-green-500">
              {publishedArticles?.length} published articles
            </h4>
          </>
        )}
      </div>

      {publishedArticles.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {publishedArticles.map((article) => (
            <div key={article._id} className="bg-white p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg border-l-4 border-green-500">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <FiFile className="w-5 h-5 text-green-500 shrink-0" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 break-words">
                      {article.title || "Untitled"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <FiClock className="w-4 h-4 shrink-0" />
                    <span className="text-sm">
                      Published: {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>
                  {article.pdfPath && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <FiFile className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        PDF File: {article.pdfPath.split('/').pop()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link 
                    className="btn-3 inline-flex items-center gap-1  text-sm " 
                    to={`/articles/article/${article._id}`}
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    Preview
                  </Link>
                  <button
                    onClick={() => {
                      setArticleId(article._id);
                      setShowDeleteArticleModal(true);
                    }}
                    className="btn-red inline-flex items-center gap-1 px-2 py-1 text-sm"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {article.pages.map((page) => (
                    <div
                      key={page._id}
                      className="px-2 py-1 bg-gray-50 rounded-full text-sm text-gray-600 flex items-center gap-1.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {page.pageNumber}
                      </span>
                      <span className="text-xs">Page {page.pageNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateArticleModel
          showModal={showModal}
          setShowModal={setShowModal}
          fetchArticles={fetchArticles}
        />
      )}

      <DeleteModal
        isOpen={showDeleteArticleModal}
        onClose={() => setShowDeleteArticleModal(false)}
        onDelete={() => handleDeleteArticle(articleId)}
        title="Delete Article"
        message="Are you sure you want to delete this article?"
        itemType="article"
      />
    </div>
  );
};

export default Articles;
