import React from 'react';

const FavoriteButton = ({ isFavorite, onToggle, className = "", ...props }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-1 -mt-1 -mr-1 ${className}`}
      aria-label="Toggle favorite"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isFavorite ? "#F37A7E" : "none"}
        stroke="#F37A7E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    </button>
  );
};

export default FavoriteButton;