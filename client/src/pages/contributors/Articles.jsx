import React, { useEffect, useState } from "react";
import CreateArticleModel from "./models/CreateArticleModel";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import DeleteModal from "@/components/shared/DeleteModal";
import PreviewPageModel from "./models/PreviewPageModel";
import {
  FiEdit2,
  FiEye,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiMonitor,
} from "react-icons/fi";
import { EditArticlePageModel } from "./models/EditArticlePageModel";

// Separate API service
const articleService = {
  getPendingArticles: async () => {
    const { data } = await customFetch.get("/articles/get-pending-articles");
    return data.articles;
  },

  createPage: async (articleId, content, pageNumber) => {
    const { data } = await customFetch.post(
      `/articles/create-article-page/${articleId}`,
      { content, pageNumber }
    );
    return data;
  },

  publishArticle: async (articleId) => {
    const { data } = await customFetch.patch(
      `/articles/publish-article/${articleId}`
    );
    return data;
  },

  deletePage: async (pageId) => {
    const { data } = await customFetch.delete(
      `/articles/delete-article-page/${pageId}`
    );
    return data;
  },
  deleteArticle: async (articleId) => {
    const { data } = await customFetch.delete(
      `/articles/delete-article/${articleId}`
    );
    return data;
  },
  updatePage: async (pageId, content, title) => {
    const { data } = await customFetch.patch(
      `/articles/edit-article/${pageId}`,
      { content, title }
    );
    console.log({ data });
    return data;
  },
  editArticlePage: async (pageId, content, title) => {
    const { data } = await customFetch.patch(
      `/articles/edit-article-page/${pageId}`,
      { content, title }
    );
    return data;
  },
  getPage: async (pageId) => {
    const { data } = await customFetch.get(
      `/articles/get-article-page/${pageId}`
    );
    return data;
  },
  viewCoverPage: async (articleId) => {
    const { data } = await customFetch.get(
      `/articles/get-article-cover-page/${articleId}`
    );
    console.log({ coverPage: data });
    return data;
  },
};

// Separate component for article actions
const ArticleActions = ({ onCreatePage, onPublish, articleId }) => (
  <div className="flex gap-4 mt-4">
    <button className="btn-1" onClick={() => onCreatePage(articleId)}>
      <FiPlus className="w-5 h-5" />
      Create Page
    </button>
    <button className="btn-2" onClick={() => onPublish(articleId)}>
      <FiCheck className="w-5 h-5" />
      Publish Article
    </button>
  </div>
);

// Separate component for page item
const PageItem = ({
  page,
  onEdit,
  onDelete,
  onPreview,
  hoveredPage,
  setHoveredPage,
}) => (
  <div
    key={page._id}
    className={`relative group ${hoveredPage === page._id ? "z-50" : "z-0"}`}
  >
    <div
      onMouseEnter={() => setHoveredPage(page._id)}
      onMouseLeave={() => setHoveredPage(null)}
      className="flex items-center gap-4 p-2 bg-white rounded-xl border-2 border-gray-100 hover:border-[var(--primary)] transition-all duration-300 transform hover:scale-102 hover:shadow-md"
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--ternery)] text-white font-medium shadow-inner">
        {page.pageNumber}
      </div>
      <div className="text-sm font-medium text-gray-700">
        Page {page.pageNumber}
      </div>

      {hoveredPage === page._id && (
        <div className="absolute top-8 w-full left-0 mt-2 bg-white rounded-xl border border-gray-100 p-1 z-50 w-42 transform transition-all duration-200 opacity-100 scale-100">
          <button
            onClick={() => onEdit(page._id)}
            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(page._id)}
            className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors gap-2"
          >
            <FiTrash2 className="w-3 h-3" />
            Delete
          </button>
          <button
            onClick={() => onPreview(page._id)}
            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors gap-2"
          >
            <FiEye fontSize={10} />
            Preview
          </button>
        </div>
      )}
    </div>
  </div>
);

const Articles = () => {
  const [showModal, setShowModal] = useState(false);
  const [articles, setArticles] = useState([]);
  const [articleId, setArticleId] = useState(null);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState("page"); // 'page' or 'cover'
  const [type, setType] = useState("");
  const [showDeleteArticleModal, setShowDeleteArticleModal] = useState(false);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [pageContent, setPageContent] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <FiMonitor className="w-16 h-16 mx-auto text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">
            Desktop View Required
          </h2>
          <p className="text-gray-600">
            Please view this page on a laptop or desktop for the best
            experience.
          </p>
        </div>
      </div>
    );
  }

  console.log({ articles });
  const fetchArticles = async () => {
    try {
      const articles = await articleService.getPendingArticles();
      setArticles(articles);
    } catch (error) {
      toast.error("Failed to fetch articles");
    }
  };

  const createArticlePage = async (articleId, content, pageNumber) => {
    try {
      await articleService.createPage(articleId, content, pageNumber);
      toast.success("Page created successfully");
      await fetchArticles();
      setShowModal(false);
    } catch (error) {
      toast.error("page already exists");
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
  const handleEditPage = async (pageId, content, title) => {
    try {
      await articleService.editArticlePage(pageId, content, title);
      toast.success("Page updated successfully");
      fetchArticles();
      setShowEditPageModal(false);
    } catch (error) {
      toast.error("Failed to update page");
    }
  };

  const handleDeletePage = async (pageId) => {
    try {
      await articleService.deletePage(pageId);
      toast.success("Page deleted successfully");
      fetchArticles();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete page");
    }
  };
  const handleGetPage = async (pageId) => {
    const data = await articleService.getPage(pageId);
    return data;
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
  const handleViewCoverPage = (id) => {
    setArticleId(id);
    setPreviewType("cover");
    setShowPreviewModal(true);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl ">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--ternery)] bg-clip-text text-transparent mb-3">
          Your Articles
        </h1>
        <p className="text-gray-600 text-lg">
          Share your knowledge and inspire others
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            setShowModal(true);
            setType("createArticle");
          }}
          className="inline-flex items-center gap-2 btn-2"
        >
          <span className="font-medium">Create New Article</span>
          <FiPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 pl-3">
        <FiAlertCircle className="w-5 h-5 text-red-500" />
        <h4 className="text-lg font-medium text-red-500">
          {articles?.length} pending articles found
        </h4>
      </div>

      {articles.length > 0 && (
        <div className="grid grid-cols-12 gap-6">
          {articles.map((article) => (
            <div key={article._id} className="col-span-12">
              <div className="bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  <span className="text-base font-medium">Title: </span>{" "}
                  {article.title || "Untitled"}
                </h3>

                <div className="mt-6 flex flex-wrap gap-4">
                  {article.pages.map((page) => (
                    <PageItem
                      key={page._id}
                      page={page}
                      onEdit={async (id) => {
                        setPageId(id);
                        const data = await handleGetPage(page._id);
                        setPageContent(data.page.pageContent);
                        setShowEditPageModal(true);
                      }}
                      onDelete={(id) => {
                        setPageId(id);
                        setShowDeleteModal(true);
                      }}
                      onPreview={(id) => {
                        setPageId(id);
                        setPreviewType("page");
                        setShowPreviewModal(true);
                      }}
                      hoveredPage={hoveredPage}
                      setHoveredPage={setHoveredPage}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 mt-6 border-t pt-4">
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                    <FiClock className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-medium mr-2">Created:</span>
                    <span>
                      {formatDistanceToNow(new Date(article.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleViewCoverPage(article._id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Cover Page
                    </button>
                    <button
                      onClick={() => {
                        setArticleId(article._id);
                        setShowDeleteArticleModal(true);
                      }}
                      className="btn-red"
                    >
                      Delete article
                    </button>
                  </div>
                </div>

                <ArticleActions
                  articleId={article._id}
                  onCreatePage={(id) => {
                    setShowModal(true);
                    setArticleId(id);
                    setType("createPage");
                  }}
                  onPublish={handlePublishArticle}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateArticleModel
          createArticlePage={createArticlePage}
          articleId={articleId}
          type={type}
          showModal={showModal}
          setShowModal={setShowModal}
          fetchArticles={fetchArticles}
        />
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => handleDeletePage(pageId)}
        title="Delete Page"
        message="Are you sure you want to delete this page?"
        itemType="page"
      />

      <DeleteModal
        isOpen={showDeleteArticleModal}
        onClose={() => setShowDeleteArticleModal(false)}
        onDelete={() => handleDeleteArticle(articleId)}
        title="Delete Article"
        message="Are you sure you want to delete this article?"
        itemType="article"
      />
      {showPreviewModal && (
        <PreviewPageModel
          onClose={() => setShowPreviewModal(false)}
          pageId={previewType === "page" ? pageId : articleId}
          type={previewType}
        />
      )}
      {showEditPageModal && (
        <EditArticlePageModel
          onClose={() => {
            console.log("close");
            setShowEditPageModal(false);
          }}
          pageId={pageId}
          content={pageContent}
          handleEditPage={handleEditPage}
        />
      )}
    </div>
  );
};

export default Articles;
