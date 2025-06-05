// components/buttons/FavoriteButton.js
import React from 'react';

const FavoriteButton = ({ 
  isFavorite, 
  onToggle, 
  className = "", 
  withCircle = false,
  ...props 
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        ${withCircle 
          ? 'p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200' 
          : 'p-1 -mt-1 -mr-1'
        } 
        ${className}
      `}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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