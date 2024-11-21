import React, { useState, useRef } from "react";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { FaPencilAlt, FaUpload, FaTimes, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const CreateArticleModel = ({
  setShowModal,
  createArticlePage,
  articleId,
  type,
  fetchArticles,
}) => {
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const [title, setTitle] = useState("");
  const previewRef = useRef(null);
  const [showImageDropdown, setShowImageDropdown] = useState(false);

  const handleSubmit = async () => {
    try {
      const { data } = await customFetch.post("/articles/create-article", {
        coverPage: content,
        title,
      });
      setShowModal(false);
      toast.success("Article created successfully");
      await fetchArticles();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleImageUpload = async (e) => {
    try {
      setIsUploading(true);
      const file = e.target.files[0]; // Only take first file
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await customFetch.post(
          "/articles/upload-image",
          formData
        );
        const imageUrl = data.imageUrl;
        const imageHtml = `<img src="${imageUrl}" alt="Uploaded image" class="max-w-full h-auto rounded-lg shadow-md" />`;
        setContent((prevContent) => prevContent + imageHtml);
        setImageUrls([{ url: imageUrl, name: "Image" }]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (url) => {
    try {
      // Extract the filename from the URL
      const filename = url.split("/").pop();

      // Send the filename as `id` in the request body
      const deleteImage = await customFetch.delete(`articles/delete-image`, {
        data: { id: filename },
      });

      // Remove image from editor content by replacing the entire img tag containing the URL
      const newContent = content.replace(new RegExp(`<img[^>]*${url}[^>]*>`, 'g'), '');
      setContent(newContent);

      // Clear image URLs array
      setImageUrls([]);
      setShowImageDropdown(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };


  const isContentOverflowing = () => {
    if (previewRef.current) {
      return previewRef.current.scrollHeight > previewRef.current.clientHeight;
    }
    return false;
  };

  return (
    <div className="flex gap-6 h-[95vh] bg-gray-50 p-6 rounded-xl">
      {/* Main Editor Section */}
      <div className="w-3/4 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-lg">
        <div className="relative">
          {type === "createPage" || type === "editPage" ? (
            <div className="relative">
              <input
                type="number"
                placeholder="Page number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base font-medium"
              />
              <label className={`absolute right-24 top-1/2 -translate-y-1/2 ${imageUrls.length > 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <FaUpload className="text-gray-400 text-xl hover:text-blue-500 transition-colors" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={isUploading || imageUrls.length > 0}
                />
              </label>
              <div className="absolute right-14 top-1/2 -translate-y-1/2 cursor-pointer">
                <FaTrash
                  className="text-gray-400 text-xl hover:text-red-500 transition-colors"
                  onClick={() => setShowImageDropdown(!showImageDropdown)}
                />
                {showImageDropdown && imageUrls.length > 0 && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    {imageUrls.map((img, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => handleImageDelete(img.url)}
                      >
                        <span>{img.name}</span>
                        <FaTimes className="text-red-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FaPencilAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base font-medium"
              />
              <label className={`absolute right-24 top-1/2 -translate-y-1/2 ${imageUrls.length > 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <FaUpload className="text-gray-400 text-xl hover:text-blue-500 transition-colors" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={isUploading || imageUrls.length > 0}
                />
              </label>
              <div className="absolute right-14 top-1/2 -translate-y-1/2 cursor-pointer">
                <FaTrash
                  className="text-gray-400 text-xl hover:text-red-500 transition-colors"
                  onClick={() => setShowImageDropdown(!showImageDropdown)}
                />
                {showImageDropdown && imageUrls.length > 0 && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    {imageUrls.map((img, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      >
                        <span>{img.name}</span>
                        <FaTimes
                          onClick={() => handleImageDelete(img.url)}
                          className="text-red-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FaPencilAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          )}
        </div>

        {isUploading && (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
          </div>
        )}

        <div className="flex-grow overflow-y-auto">
          <ReactQuill
            value={content}
            onChange={handleEditorChange}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }], // Alignment options added here
                ["link"],
                ["clean"],
              ],
            }}
            className="h-[500px]"
          />
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all duration-200 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          <button
            disabled={isContentOverflowing()}
            onClick={
              type === "createPage"
                ? () =>
                    createArticlePage(articleId, content, Number(pageNumber))
                : handleSubmit
            }
            className="px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col">
        <div
          ref={previewRef}
          className="p-4 sm:p-8 bg-white shadow-lg overflow-auto w-[500px] h-[560px]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {isContentOverflowing() && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
            Warning: Content is getting long. Consider adding a new page.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateArticleModel;
