import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import customFetch from '@/utils/customFetch';
import { useParams, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import DeleteModal from '@/components/shared/DeleteModal';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingArticleId, setDeletingArticleId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const user = useOutletContext();
  const { id: paramsId } = useParams();

  useEffect(() => {
    if (paramsId) {
      fetchUserArticles();
    }
  }, [paramsId]);

  const fetchUserArticles = async () => {
    try {
      const response = await customFetch.get(`articles/user/${paramsId}`);
      setArticles(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch articles');
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await customFetch.delete(`/articles/${deletingArticleId}`);
      setArticles(articles.filter(article => article._id !== deletingArticleId));
      toast.success('Article deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingArticleId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete article');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setTitle('');
    setContent('');
    setIsCreateModalOpen(true);
  };

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      
      setArticles(articles.map(article => 
        article._id === editingArticle._id ? response.data : article
      ));
      
      setIsEditModalOpen(false);
      setEditingArticle(null);
      resetForm();
      toast.success('Article updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await customFetch.post('/articles', {
        title,
        content
      });
      
      setArticles([response.data, ...articles]);
      setIsCreateModalOpen(false);
      resetForm();
      toast.success('Article created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create article');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isOwnProfile = user?._id === paramsId;

  const ArticleModal = ({ isOpen, onClose, title: modalTitle, onSubmit, submitText }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--grey--900)]">{modalTitle}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--grey--700)]">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-[var(--pure)] px-4 py-2 text-[var(--grey--900)] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--grey--700)] mb-2">
                  Content
                </label>
                <Editor
                  apiKey="jnca4pglh1yq9yamj1klvg3i3f6bz039dte8l0yu6qaxotis"
                  value={content}
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    skin: 'oxide',
                    content_css: 'default',
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    submitText
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--grey--900)]">
          {isOwnProfile ? 'My Articles' : `${user?.name}'s Articles`}
        </h1>
        {isOwnProfile && (
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create New Article
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-[var(--grey--600)] text-lg mb-4">
            {isOwnProfile 
              ? "You haven't created any articles yet."
              : `${user?.name} hasn't created any articles yet.`}
          </p>
          {isOwnProfile && (
            <button
              onClick={handleCreate}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Create your first article
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--grey--900)] mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {article.title}
                </h2>
              
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[var(--grey--500)]">
                    {new Date(article.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Edit article"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingArticleId(article._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Delete article"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Article Modal */}
      <ArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Article"
        onSubmit={handleCreateSubmit}
        submitText="Create Article"
      />

      {/* Edit Article Modal */}
      <ArticleModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit Article"
        onSubmit={handleUpdate}
        submitText="Update Article"
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingArticleId(null);
        }}
        onDelete={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        itemType="article"
      />
    </div>
  );
};

export default Articles;
