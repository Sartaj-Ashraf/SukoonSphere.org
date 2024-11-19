import React from "react";
import { TAGS } from "../../../../utils/constants";
import { Form, useActionData } from "react-router-dom";

const QuestionModal = ({ isOpen, onClose }) => {
  const data = useActionData();
  if (!isOpen) return null;

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl scale-100">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white pt-2">Ask a Question</h3>
        {data?.error && (
          <div className="mb-4 p-3 text-red-600 bg-red-50 rounded-[10px] border border-red-200">
            <p className="font-medium">{data.error.split(",")[0]}</p>
          </div>
        )}

        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              name="questionText"
              placeholder="Your Question"
              className="input w-full p-3 rounded-[10px] bg-gray-50 text-gray-800 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <textarea
              placeholder="More Details"
              name="context"
              rows="3"
              className="textarea w-full p-3 rounded-[10px] bg-gray-50 text-gray-800 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Add Relevant Tags
            </label>
            <select
              name="tags"
              multiple
              className="w-full p-3 rounded-[10px] bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 max-h-32"
            >
              {Object.values(TAGS).map((tag) => (
                <option key={tag} value={tag} className="py-1 px-3 hover:bg-blue-50">
                  {tag}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 italic">
              Pro tip: Hold Ctrl/Cmd to select multiple tags that best describe your post
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-2"
            >
              Add Question
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default QuestionModal;
