import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";

const CreateArticleModel = ({ setShowModal }) => {
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfPreview({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10">
      <div className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-4xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
          Create Article
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Enter article title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--white-color)] rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ease-in-out duration-300 placeholder-gray-400"
          />
          <div className="relative">
            <input
              type="file"
              name="pdf"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {pdfPreview && (
              <div className="flex flex-col gap-2">
                <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
                  <span>{pdfPreview.name}</span>
                  <span>{pdfPreview.size}</span>
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md">
                  <span className="font-semibold">
                    PDF selected. You can re-upload to edit if needed.
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="btn-1 w-full py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-2 w-full py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
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
