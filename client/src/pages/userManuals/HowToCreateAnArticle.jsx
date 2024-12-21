import React from 'react';
import { FaFilePdf, FaCheckCircle } from 'react-icons/fa';

const HowToCreateAnArticle = () => {
  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 mb-4 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-3">
          <FaFilePdf />
          How to Create an Article
        </h1>
        <p className="text-[var(--grey--800)] mb-8">
          Follow this step-by-step guide to upload and publish your articles on SukoonSphere.
        </p>

        {/* Steps Container */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Getting Started
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Click on the "Create Article" button in your articles dashboard.</p>
              <p>• A modal will appear with the article creation form.</p>
              <p>• Use the rich text editor to format your article content.</p>
              <p>• Ensure your content is finalized before submission.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Article Details
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Enter a clear and descriptive title for your article.</p>
              <p>• Write your article content using the editor's features to format text, add images, and more.</p>
              <p>• Review your article for any errors before clicking "Create".</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Publishing Your Article
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Click the "Create" button to publish your article.</p>
              <p>• Your article will appear in your articles dashboard.</p>
              <p>• You can edit or delete your article later if needed.</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Tips for Writing Articles
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Use headings and subheadings to organize your content.</p>
              <p>• Include images or links to enhance your article.</p>
              <p>• Proofread your article to ensure clarity and correctness.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToCreateAnArticle;