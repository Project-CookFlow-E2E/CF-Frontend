import FavoriteButton from './buttons/FavoriteButton';

const Card = ({ id, image, name, category, time, isFavorite, onToggleFavorite }) => {
  return (
    <div 
      className="w-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      data-testid={`card-${id}`}
    >
      {/* Image */}
      <div className="h-40 bg-gray-200 flex items-center justify-center" data-testid="card-image">
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
          <h3 className="text-lg font-bold text-gray-900" data-testid="card-title">
            {name || 'Swamp Soup'}
          </h3>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(id)}
            data-testid={`favorite-button-${id}`}
          />
        </div>

        {/* Category and time */}
        <div className="flex justify-between items-center">
          <p
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            data-testid="card-category"
          >
            {category || 'LUNCH'}
          </p>
          <div className="flex items-center text-gray-600 text-sm" data-testid="card-time">
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