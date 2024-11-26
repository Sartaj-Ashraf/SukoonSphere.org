import React from 'react';

const ProfileDetail = ({ expertise, education, highlights, experience, educationDetails, organizationName, organizationDescription, editorialProcess }) => {
  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-br shadow-sm from-white to-blue-50/40 min-h-screen p-4 sm:p-8 rounded-lg">
      <div className="mx-auto space-y-12">
        {/* Highlights Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Highlights
          </h2>
          <ul className="space-y-4 text-gray-700">
            {highlights.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-green-600 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Experience
          </h2>
          <div className="space-y-4">
            <ul className="space-y-4 text-gray-700">
              {experience.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Education
          </h2>
          <ul className="space-y-4 text-gray-700">
            {educationDetails.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="text-green-600 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            About {organizationName}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {organizationDescription}
          </p>
          <p className="mt-4 text-gray-600 italic">
            {editorialProcess}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
