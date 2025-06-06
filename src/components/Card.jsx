import FavoriteButton from './buttons/FavoriteButton';

/**
 * Card muestra una tarjeta visual con imagen, título, categoría, tiempo y botón de favorito.
 *
 * Ideal para listas de recetas u otros elementos seleccionables.
 *
 * @component
 * @param {object} props - Props del componente.
 * @param {number|string} props.id - ID único del ítem (usado para manejar favoritos).
 * @param {string} props.image - URL de la imagen a mostrar.
 * @param {string} props.name - Nombre o título del ítem.
 * @param {string} props.category - Categoría del ítem (por ejemplo: desayuno, almuerzo...).
 * @param {string} props.time - Tiempo estimado asociado (ej: "20 m").
 * @param {boolean} props.isFavorite - Indica si el ítem está marcado como favorito.
 * @param {Function} props.onToggleFavorite - Función para manejar el cambio de estado de favorito.
 * @returns {JSX.Element} Tarjeta visual con contenido y acción de favorito.
 */
const Card = ({ id, image, name, category, time, isFavorite, onToggleFavorite }) => {
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
          <FavoriteButton 
            isFavorite={isFavorite}
            onToggle={() => onToggleFavorite(id)}
          />
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
