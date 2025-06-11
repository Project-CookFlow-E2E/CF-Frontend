import Button from "./Button";
import PropTypes from "prop-types";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

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
 *
 * @modifiedby Ángel Aragón
 * @modified Sustituido el componente de FavoriteButton por el componente reutilizable Button e implementado ReactIcons para los íconos de favorito.
 * 
 * @modifiedby Ana Castro
 * @modified Adaptado para que el componente Card pueda recibir props y así no tener que usar RecipeCard.jsx, cambios de estilos.
 */
const Card = ({
  id,
  image,
  name,
  category,
  time,
  isFavorite,
  onClick,
  onToggleFavorite,
  className = "",
  imageClassName = "",
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer w-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div
        className={`relative h-40 bg-gray-200 flex items-center justify-center ${imageClassName}`}
        data-testid="card-image"
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">No image</span>
        )}
      </div>

      <div className="p-4 bg-secondary flex flex-col justify-between min-h-[140px] text-left">
        <div className="flex justify-between items-start mb-1">
          <h3
            className="text-lg font-bold text-gray-900 pr-2"
            data-testid="card-title"
          >
            {name || "Swamp Soup"}
          </h3>
          {onToggleFavorite && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(id);
              }}
              aria-label={
                isFavorite ? "Quitar de Favoritos" : "Agregar a Favoritos"
              }
              className={`${"p-3 hover:bg-transparent bg-transparent text-[#F37A7E]"}`}
            >
              {isFavorite ? (
                <BsBookmarkFill size={20} />
              ) : (
                <BsBookmark size={20} color="#F37A7E" />
              )}
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            data-testid="card-category"
          >
            {category || "LUNCH"}
          </p>
          <div
            className="flex items-center text-gray-600 text-sm"
            data-testid="card-time"
          >
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
            <span>{time || "20 m"}</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  time: PropTypes.string,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: () => {},
};

export default Card;
