import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";

const CreateArticleModel = ({setShowModal}) => {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    if (!pdfFile) {
      toast.error("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", pdfFile);

    try {
      const response = await customFetch.post("/articles/upload-pdf", formData);
      toast.success("Article created successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error(error?.response?.data?.error || "Error creating article");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-[500px] shadow-2xl transform transition-all hover:scale-[1.02]">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Create Article</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="title" 
            placeholder="Enter article title..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <div className="relative">
            <input 
              type="file" 
              name="pdf" 
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" 
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              className="btn-1"
            >
              Create
            </button>
            <button 
              type="button" 
              onClick={() => setShowModal(false)}
              className="btn-2" 
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleModel;