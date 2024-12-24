import { useState, useEffect, useRef, useMemo, memo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import ReactQuill from "react-quill";
import JoditEditor from "jodit-react";
import "react-quill/dist/quill.snow.css";
import customFetch from "@/utils/customFetch";
import {
  useParams,
  useOutletContext,
  useSearchParams,
  Link,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaTimesCircle,
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import ArticleGallery from "@/components/ArticleGallery";
import ArticleCard from "../../components/ArticleCard";
import Pagination from "../../components/Pagination";
import { FiCalendar, FiClock } from "react-icons/fi";
import { MdMultipleStop } from "react-icons/md";

const Articles = () => {
  const editor = useRef(null);
  // const config = useMemo(
  //   {
  //     readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //     placeholder: placeholder || 'Start typings...'
  //   },
  //   [placeholder]
  // );

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingArticleId, setDeletingArticleId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState(null);
  const user = useOutletContext();

  const { id: paramsId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "newest";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [searchInput, setSearchInput] = useState(searchQuery);

  const filterOptions = [
    {
      value: "newest",
      label: "Newest First",
      icon: <FiClock className="w-4 h-4" />,
    },
    {
      value: "oldest",
      label: "Oldest First",
      icon: <FiCalendar className="w-4 h-4" />,
    },
    {
      value: "title",
      label: "A-Z",
      icon: <MdMultipleStop className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (searchInput) {
            newParams.set("search", searchInput);
          } else {
            newParams.delete("search");
          }
          newParams.set("page", "1"); // Reset to first page on search
          return newParams;
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchParams]);

  useEffect(() => {
    if (paramsId) {
      fetchUserArticles();
    }
  }, [paramsId, currentPage, currentFilter, searchQuery]);

  const fetchUserArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        sortBy: currentFilter,
        ...(searchQuery && { search: searchQuery }),
      });
      const response = await customFetch.get(
        `articles/user/${paramsId}?${params}`
      );
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch articles");
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("filter", value);
      newParams.set("page", "1"); // Reset to first page on filter change
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", newPage.toString());
        return newParams;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/articles/${deletingArticleId}`);
      await fetchUserArticles(); // Refresh the list after delete
      toast.success("Article deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingArticleId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete article");
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async ({ title, content, image }) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await customFetch.post("/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchUserArticles(); // Refresh the list after create
      setIsCreateModalOpen(false);
      toast.success("Article created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async ({ title, content, image }) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await customFetch.put(`/articles/${editingArticle._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchUserArticles(); // Refresh the list after update
      setIsEditModalOpen(false);
      setEditingArticle(null);
      toast.success("Article updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const isOwnProfile = user?._id === paramsId;

  const ArticleModal = memo(
    ({
      isOpen,
      onClose,
      title: headerTitle,
      onSubmit,
      submitText,
      initialTitle = "",
      initialContent = "",
    }) => {
      const [modalTitle, setModalTitle] = useState(initialTitle);
      const [modalContent, setModalContent] = useState(initialContent);
      const [selectedImage, setSelectedImage] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);
      const editorRef = useRef(null);

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
          title: modalTitle,
          content: modalContent,
          image: selectedImage,
        });
      };

      if (!isOpen) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full h-full flex">
            {/* Left Sidebar - Gallery */}
            <div className="w-1/4 border-r border-gray-200 flex flex-col h-full">
              <ArticleGallery
                onImageUrlCopy={(url) => {
                  if (editorRef.current) {
                    const editor = editorRef.current;
                    editor.selection.insertHTML(
                      `<img src="${url}" alt="" style="max-width: 100%; height: auto;" />`
                    );
                  }
                }}
              />
            </div>

            {/* Right Side - Editor */}
            <div className="flex-1 flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[var(--grey--900)]">
                    {headerTitle}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-[var(--grey--700)]"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={modalTitle}
                        onChange={(e) => setModalTitle(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-200 bg-[var(--pure)] px-4 py-2 text-[var(--grey--900)] focus:border-blue-500 focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[var(--grey--700)] mb-2">
                        Featured Image
                      </label>
                      <div className="mt-1 flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imagePreview && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImage(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[var(--grey--700)] mb-2">
                        Content
                      </label>
                      <div className="h-auto">
                        <JoditEditor
                          ref={editorRef}
                          value={modalContent}
                          config={{
                            readonly: false,
                            placeholder: "Start typing...",
                            height: "auto",
                            minHeight: "300px",
                            maxHeight: "auto",
                          }}
                          tabIndex={1}
                          onBlur={(newContent) => setModalContent(newContent)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4 mt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-red flex items-center justify-center gap-2"
                    >
                      <FaTimesCircle />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Saving..." : submitText}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Articles
              </h2>
              <p className="mt-2 text-[var(--grey--800)]">
                Don't know how to upload an article? Check out our{" "}
                <Link
                  to="/user-manual/create-article"
                  className="text-blue-500 hover:underline"
                >
                  user manual
                </Link>{" "}
                for a step-by-step guide.
              </p>
            </div>
            {isOwnProfile && (
              <button
                onClick={handleCreate}
                className="btn-2 flex gap-2 items-center"
              >
                Create Article
                <FaPlus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium gap-2 ${
                  currentFilter === option.value
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : " text-[var(--grey--700)] hover:bg-gray-100"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error ? (
        <div className="text-center p-4 bg-red-100 rounded-lg text-red-700">
          {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No articles found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                isOwnProfile={isOwnProfile}
                onEdit={() => handleEdit(article)}
                onDelete={() => {
                  setDeletingArticleId(article._id);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
      <ArticleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingArticle(null);
        }}
        title="Edit Article"
        onSubmit={handleUpdate}
        submitText="Update Article"
        initialTitle={editingArticle?.title || ""}
        initialContent={editingArticle?.content || ""}
      />
      <ArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        title="Create New Article"
        onSubmit={handleCreateSubmit}
        submitText="Create Article"
        initialTitle=""
        initialContent=""
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingArticleId(null);
        }}
        onDelete={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
      />
    </div>
  );
};

export default Articles;
