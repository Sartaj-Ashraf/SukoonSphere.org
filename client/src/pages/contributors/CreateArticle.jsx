import { useState, useMemo, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@/styles/editor.css';
import customFetch from '@/utils/customFetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Memoize the modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // Memoize the formats configuration
  const formats = useMemo(() => [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ], []);

  // Memoize the onChange handler
  const handleEditorChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);

    try {
      await customFetch.post('/articles', {
        title,
        content
      });
      
      toast.success('Article created successfully');
      navigate('/articles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="editor-container">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="h-96">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleEditorChange}
              modules={modules}
              formats={formats}
              className="h-full"
              preserveWhitespace
            />
          </div>
        </div>

        <div className="mt-16">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
