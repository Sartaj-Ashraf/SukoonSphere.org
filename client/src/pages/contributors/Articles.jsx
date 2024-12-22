import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import ReactQuill from 'react-quill';
import JoditEditor from 'jodit-react';
import 'react-quill/dist/quill.snow.css';
import customFetch from '@/utils/customFetch';
import { useParams, useOutletContext, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimes, FaEdit, FaTrash, FaSpinner, FaSearch, FaPlus, FaTimesCircle } from 'react-icons/fa';
import { IoCloseOutline } from "react-icons/io5";
import DeleteModal from '@/components/shared/DeleteModal';
import PostActions from '@/components/shared/PostActions';
import ArticleGallery from '@/components/ArticleGallery';

const Articles = () => {
  const editor = useRef(null);
  // const config = useMemo(
	// 	{
	// 		readonly: false, // all options from https://xdsoft.net/jodit/docs/,
	// 		placeholder: placeholder || 'Start typings...'
	// 	},
	// 	[placeholder]
	// );

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
  const currentFilter = searchParams.get('filter') || 'newest';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [searchInput, setSearchInput] = useState(searchQuery);

  const filterOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'By Title' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (searchInput) {
            newParams.set('search', searchInput);
          } else {
            newParams.delete('search');
          }
          newParams.set('page', '1'); // Reset to first page on search
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
        ...(searchQuery && { search: searchQuery })
      });
      const response = await customFetch.get(`articles/user/${paramsId}?${params}`);
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch articles');
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('filter', value);
      newParams.set('page', '1'); // Reset to first page on filter change
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', newPage.toString());
        return newParams;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/articles/${deletingArticleId}`);
      await fetchUserArticles(); // Refresh the list after delete
      toast.success('Article deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingArticleId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete article');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdate = async ({ title, content }) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await customFetch.put(`/articles/${editingArticle._id}`, {
        title,
        content
      });
      await fetchUserArticles(); // Refresh the list after update
      setIsEditModalOpen(false);
      setEditingArticle(null);
      toast.success('Article updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubmit = async ({ title, content }) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await customFetch.post('/articles', {
        title,
        content
      });
      await fetchUserArticles(); // Refresh the list after create
      setIsCreateModalOpen(false);
      toast.success('Article created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create article');
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

  const ArticleModal = memo(({ isOpen, onClose, title: headerTitle, onSubmit, submitText, initialTitle = '', initialContent = '' }) => {
    const [modalTitle, setModalTitle] = useState(initialTitle);
    const [modalContent, setModalContent] = useState(initialContent);
    const editorRef = useRef(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        title: modalTitle,
        content: modalContent
      });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full h-full flex">
          {/* Left Sidebar - Gallery */}
          <div className="w-1/4 border-r border-gray-200 flex flex-col h-full">
            <ArticleGallery onImageUrlCopy={(url) => {
              if (editorRef.current) {
                const editor = editorRef.current;
                editor.selection.insertHTML(`<img src="${url}" alt="" style="max-width: 100%; height: auto;" />`);
              }
            }} />
          </div>

          {/* Right Side - Editor */}
          <div className="flex-1 flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--grey--900)]">{headerTitle}</h2>
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
                    <label htmlFor="title" className="block text-sm font-medium text-[var(--grey--700)]">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-[var(--pure)] px-4 py-2 text-[var(--grey--900)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      required
                    />
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
                          placeholder: 'Start typing...',
                          height: 'auto',
                          minHeight: '300px',
                          maxHeight: 'auto',
                        
                        }}
                        tabIndex={1}
                        onBlur={newContent => setModalContent(newContent)}
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
                    {submitting ? 'Saving...' : submitText}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-4 py-8">
      <div className="flex flex-col gap-4 mb-6 rounded-lg ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--grey--900)]">My Articles</h2>
          <p className="text-[var(--grey--800)]">
            Dont know how to upload a article? Check out our{" "}
            <Link to={"/user-manual/create-article"} className="text-blue-500 hover:underline">
              user manual
            </Link>{" "}

            for a step-by-step guide.
          </p>
          </div>
          {isOwnProfile && (
            <button
              onClick={handleCreate}
              className="btn-2 flex items-center gap-2"
            >
              Create Article
              <FaPlus className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="relative">
          {/* <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-[var(--white-color)] py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          /> */}
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchParams(prev => {
                  const newParams = new URLSearchParams(prev);
                  newParams.delete('search');
                  return newParams;
                });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 shadow-md p-1 bg-white rounded-lg">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`p-1 sm:px-1 sm:py-1 md:px-2 lg:px-3 lg:py-2 text-xs md:text-sm rounded-full transition-colors flex items-center gap-1 ${currentFilter === option.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--grey--800)] hover:bg-gray-100 hover:shadow-sm'
                }`}
            >
              <span className="sm:hidden md:block">{option.label}</span>
              <span className="hidden sm:block md:hidden">{option.shortLabel}</span>
            </button>
          ))}
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
              <div
                key={article._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <Link
                    to={`/articles/article/${article._id}`}
                    className="text-lg font-semibold text-[var(--grey--900)] hover:text-[var(--ternery)] cursor-pointer mb-2"
                  >
                    {article.title}
                  </Link>
                  <div className="text-sm text-gray-500 mb-4">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  {isOwnProfile && (
                    <PostActions  />
                  )}
                    {/* <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingArticleId(article._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div> */}
                  {/* )} */}
                </div>
              </div>
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-[var(--grey--600)]">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`px-4 py-2 rounded-lg ${currentPage === pagination.totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                Next
              </button>
            </div>
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
        initialTitle={editingArticle?.title || ''}
        initialContent={editingArticle?.content || ''}
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
