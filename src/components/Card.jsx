import React from 'react';

const Card = ({ image, name, category, time }) => {
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
      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-1 text-left">
          {name || 'Swamp Soup'}
        </h3>

        {/* Category and time */}
        <div className="flex justify-between items-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
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