import React from 'react';

const Spinner = ({ size = 'medium' }) => {
  // Size classes for different spinner sizes
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-t-[var(--primary)] border-r-transparent border-b-[var(--secondary)] border-l-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner; 