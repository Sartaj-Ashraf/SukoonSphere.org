import React from 'react';
import { FaVideo, FaYoutube, FaImage, FaInfoCircle, FaCheckCircle, FaShareAlt } from 'react-icons/fa';

const HowToCreateAVideo = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-3">
          <FaVideo />
          How to Create a Video
        </h1>
        <p className="text-[var(--grey--800)] mb-8">
          Follow this step-by-step guide to create and share your videos on SukoonSphere
        </p>

        {/* Steps Container */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Getting Started
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Click on the "Create video" button in your videos dashboard</p>
              <p>• A modal will appear with the video creation form</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Video Details
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Enter a clear and descriptive title for your video</p>
              <p>• Write a detailed description explaining what viewers will learn</p>
              <p>• Select the video type: "Single Video" or "Playlist"</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              <FaYoutube className="text-red-600" />
              Getting Your YouTube Video URL
            </h2>
            <div className="space-y-6 text-[var(--grey--800)]">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FaShareAlt />
                  How to get the video URL:
                </h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <p className="font-medium mb-2">Method 1: From YouTube Video Page</p>
                    <ol className="list-decimal ml-4 space-y-2">
                      <li>Go to your YouTube video</li>
                      <li>Click the "Share" button below the video</li>
                      <li>Copy the URL that appears in the share dialog</li>
                      <img 
                        src="https://i.imgur.com/8XZB5cN.png" 
                        alt="YouTube share button" 
                        className="mt-2 rounded-lg border shadow-sm"
                      />
                    </ol>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <p className="font-medium mb-2">Method 2: From YouTube URL Bar</p>
                    <ol className="list-decimal ml-4 space-y-2">
                      <li>Go to your YouTube video</li>
                      <li>Copy the URL from your browser's address bar</li>
                      <img 
                        src="https://i.imgur.com/JYwuLRM.png" 
                        alt="YouTube URL bar" 
                        className="mt-2 rounded-lg border shadow-sm"
                      />
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-semibold">Valid URL Examples:</p>
                    <div className="mt-2 space-y-2 font-mono text-sm bg-white p-3 rounded">
                      <p> https://youtu.be/abcd1234xyz</p>
                      <p> https://www.youtube.com/watch?v=abcd1234xyz</p>
                      <p> https://youtube.com/shorts/abcd1234xyz</p>
                      <p className="text-red-500 mt-4"> https://youtube.com/channel/abcd1234</p>
                      <p className="text-red-500"> https://youtube.com/playlist?list=abcd1234</p>
                    </div>
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
              <FaImage />
              Cover Image
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Upload an attractive cover image for your video</p>
              <p>• Maximum file size: 5MB</p>
              <p>• Recommended dimensions: 1280x720 pixels (16:9 ratio)</p>
              <p>• Supported formats: JPG, PNG</p>
              <div className="bg-white border rounded-lg p-4 mt-2">
                <p className="font-medium mb-2">Pro Tip: Getting a Good Thumbnail</p>
                <ol className="list-decimal ml-4 space-y-2">
                  <li>You can use YouTube's auto-generated thumbnails</li>
                  <li>Screenshot a key moment from your video</li>
                  <li>Create a custom thumbnail using tools like Canva</li>
                  <img 
                    src="https://i.imgur.com/K2qA4XE.png" 
                    alt="YouTube thumbnail example" 
                    className="mt-2 rounded-lg border shadow-sm"
                  />
                </ol>
              </div>
            </div>
          </div>

          {/* Final Step */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
              <FaCheckCircle />
              Publishing Your Video
            </h2>
            <div className="space-y-3 text-[var(--grey--800)]">
              <p>• Review all the information you've entered</p>
              <p>• Click the "Create Video" button</p>
              <p>• Wait for the success message</p>
              <p>• Your video will appear in your videos dashboard</p>
              <div className="bg-white border rounded-lg p-4 mt-2">
                <p className="font-medium text-green-600">Success Example:</p>
                <img 
                  src="https://i.imgur.com/9FZNYv4.png" 
                  alt="Success message example" 
                  className="mt-2 rounded-lg border shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToCreateAVideo;