import React from 'react';
import { FaFilePdf, FaInfoCircle, FaCheckCircle, FaUpload, FaEdit } from 'react-icons/fa';

const HowToCreateAnArticle = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-3">
          <FaFilePdf />
          How to Create an Article
        </h1>
        <p className="text-[var(--grey--800)] mb-8">
          Follow this step-by-step guide to upload and publish your articles on SukoonSphere
        </p>

        {/* Steps Container */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Prepare Your Article
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Create your article content in a PDF format</p>
              <p>• Ensure your content is complete and finalized</p>
              <p>• Review the PDF for any formatting issues</p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">Important Note:</p>
                    <p className="mt-1">Once published, the article cannot be edited. Make sure your content is finalized before uploading.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Start Upload Process
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Navigate to your articles dashboard</p>
              <p>• Click the "Create New Article" button</p>
              <p>• A modal will appear for uploading your article</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Upload Your Article
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Enter a clear and descriptive title for your article</p>
              <p>• Click the upload area or browse to select your PDF file</p>
              <p>• Verify the file name and size in the preview</p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">File Requirements:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Must be in PDF format</li>
                      <li>• Ensure file size is reasonable</li>
                      <li>• File should be properly formatted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                4
              </span>
              Review and Publish
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Your article will appear in the "Pending Articles" section</p>
              <p>• Use the "Preview" button to review your article</p>
              <p>• Click "Publish" when ready to make it public</p>
              <div className="flex items-center gap-2 mt-4 text-green-600">
                <FaCheckCircle />
                <span>Your article will be converted into an interactive flipbook!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToCreateAnArticle;