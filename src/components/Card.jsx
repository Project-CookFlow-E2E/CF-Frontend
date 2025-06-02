import React, { useState, useEffect } from 'react';

const Card = ({ id, image, name, category, time }) => {
  const storageKey = `favorite-${id}`;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setIsFavorite(saved === 'true');
  }, [storageKey]);

  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    localStorage.setItem(storageKey, newState);
  };

  return (
    <div className="w-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="h-40 bg-gray-200 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">No image</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-secondary">
        {/* Title and bookmark in one line */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-900">
            {name || 'Swamp Soup'}
          </h3>
          <button
            onClick={toggleFavorite}
            className="p-1 -mt-1 -mr-1"
            aria-label="Toggle favorite"
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
        </div>

        {/* Category and time */}
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {category || 'LUNCH'}
          </p>
          <div className="flex items-center text-gray-600 text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{time || '20 m'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
