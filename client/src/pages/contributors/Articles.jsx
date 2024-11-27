import React, { useEffect, useState } from "react";
import CreateArticleModel from "./models/CreateArticleModel";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { FiPlus, FiCheck, FiAlertCircle, FiTrash2, FiClock, FiFile, FiEye } from "react-icons/fi";
import DeleteModal from "@/components/shared/DeleteModal";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";

// Simplified API service with only essential operations
const articleService = {
  getPendingArticles: async () => {
    try {
      const { data } = await customFetch.get("/articles/get-pending-articles");
      return data.articles || [];
    } catch (error) {
      console.error('Error fetching pending articles:', error);
      return [];
    }
  },

  getPublishedArticles: async (id) => {
    try {
      const { data } = await customFetch.get(`articles/get-published-articles-by-user/${id}`);
      return data.articles || [];
    } catch (error) {
      console.error('Error fetching published articles:', error);
      return [];
    }
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
  const {id: ParamId} = useParams()
  const user = useOutletContext();
  const {user : currentUser} = useUser();

  const fetchArticles = async () => {
    try {
      // Always fetch published articles
      const published = await articleService.getPublishedArticles(ParamId);
      setPublishedArticles(published || []);

      // Only fetch pending articles if user is contributor and viewing their own profile
      if (user?.role === "contributor" && currentUser?._id === ParamId) {
        const pending = await articleService.getPendingArticles();
        setPendingArticles(pending || []);
      } else {
        setPendingArticles([]); // Clear pending articles if not authorized
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error("Failed to fetch articles");
      setPendingArticles([]);
      setPublishedArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [user?.role, currentUser?._id, ParamId]); // Re-fetch when these values change

  const handlePublishArticle = async (articleId) => {
    try {
      await articleService.publishArticle(articleId);
      toast.success("Article published successfully");
      fetchArticles();
    } catch (error) {
      console.log(error)
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
  console.log({pendingArticles,
    publishedArticles
  })
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Create Article Button Section */}
      {user?.role === "contributor" && currentUser?._id === ParamId && (
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
      )}

      {/* Pending Articles Section - Only show if user is contributor and viewing own profile */}
      {user?.role === "contributor" && currentUser?._id === ParamId && pendingArticles && pendingArticles.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-6 pl-3">
            <FiAlertCircle className="w-5 h-5 text-red-500" />
            <h4 className="text-lg font-medium text-red-500">
              {pendingArticles.length} pending articles found
            </h4>
          </div>

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
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    className="bg-blue-500 text-white inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-[6px] hover:bg-blue-600 hover:scale-105 transition-all duration-300"
                    to={`/articles/article/${article._id}`}
                  >
                    <FiEye className="w-4 h-4" />
                    Preview
                  </Link>
                  <button
                    onClick={() => handlePublishArticle(article._id)}
                    className="bg-[var(--secondary)] inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-[6px] hover:scale-105 transition-all duration-300 hover:bg-[var(--secondary-hover)]"
                  >
                    <FiCheck className="w-4 h-4" />
                    Publish
                  </button>
                  <button
                    onClick={() => {
                      setArticleId(article._id);
                      setShowDeleteArticleModal(true);
                    }}
                    className="btn-red inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {article.pages && article.pages.length > 0 && (
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
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Published Articles Section - Show for everyone */}
      {publishedArticles && publishedArticles.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-6 pl-3">
            <FiCheck className="w-5 h-5 text-green-500" />
            <h4 className="text-lg font-medium text-green-500">
              {publishedArticles.length} published articles
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {publishedArticles.map((article) => (
              <div key={article._id} className="bg-white p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg border-l-4 border-green-500">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <FiFile className="w-5 h-5 text-green-500 shrink-0" />
                      <Link
                        to={`/articles/article/${article._id}`}
                        className="text-lg sm:text-xl font-bold text-gray-800 break-words"
                      >
                        {article.title || "Untitled"}
                      </Link>
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
                </div>

               {
                user?.role === "contributor" && currentUser?._id === ParamId &&(
                  <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    className="btn-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
                    to={`/articles/article/${article._id}`}
                  >
                    <FiEye className="w-4 h-4" />
                    Preview
                  </Link>
                  <button
                    onClick={() => {
                      setArticleId(article._id);
                      setShowDeleteArticleModal(true);
                    }}
                    className="btn-red inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
                ) 
               }  

                {article.pages && article.pages.length > 0 && (
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
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* No Articles Message */}
      {(!pendingArticles || pendingArticles.length === 0) && 
       (!publishedArticles || publishedArticles.length === 0) && (
        <div className="text-center py-8">
          <h3 className="text-lg text-gray-600">No articles found</h3>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <CreateArticleModel
          setShowModal={setShowModal}
          onArticleCreated={fetchArticles}
        />
      )}

      <DeleteModal
        isOpen={showDeleteArticleModal}
        setIsOpen={setShowDeleteArticleModal}
        onDelete={() => handleDeleteArticle(articleId)}
      />
    </div>
  );
};

export default Articles;
