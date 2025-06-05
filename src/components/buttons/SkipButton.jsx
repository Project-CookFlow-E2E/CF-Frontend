// components/buttons/SkipButton.js
import React from 'react';

const SkipButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
      aria-label="Skip recipe"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
};

export default SkipButton;