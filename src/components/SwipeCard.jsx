import TimerBadge from "./TimerBadge";
import Button from "./Button";
import { IoMdClose } from "react-icons/io";
import { BsBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

/**
 * Componente SwipeCard para mostrar una tarjeta de receta con opciones de interacción.
 * Permite marcar como favorito, saltar a la siguiente receta y ver detalles de la receta.
 * @component
 * @param {Object} props - Props del componente.
 * @param {Object} props.recipe - Objeto de receta con detalles como id, nombre, imagen, duración, etc.
 * @param {Function} props.onToggleFavorite - Función para manejar el cambio de estado de favorito.
 * @param {Function} props.onSkip - Función para manejar el salto a la siguiente receta.
 * @returns {JSX.Element} Tarjeta de receta con imagen, título, descripción, categoría y botones de acción.
 * @author Hema Priya
 *
 * @modifiedby Ángel Aragón
 * @modified
 * - Creada documentación.
 * - Cambiado el componente de FavoriteButton por el componente reutilizable Button e implementado ReactIcons para los íconos de favorito y cerrar.
 * - Cambiado el componente de SkipButton por el componente reutilizable Button e implementado ReactIcons para el ícono de cerrar.
 * - Agregado botón para ver detalles de la receta que redirige a la página de detalles de la receta usando Navigate de react-router-dom.
 */
const SwipeCard = ({ recipe, onToggleFavorite, onSkip }) => {
  const navigate = useNavigate();
  const handleFavoriteToggle = () => {
    onToggleFavorite(recipe.id);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div
      className="flex flex-col items-center w-full px-4 pb-6"
      style={{ backgroundColor: "#FDF3E8" }}
      data-testid="swipe-card"
    >
      <div
        className="relative w-full mb-4 aspect-[4/3] max-h-80"
        data-testid="recipe-image-container"
      >
        <div className="bg-gray-100 rounded-xl w-full h-full flex items-center justify-center overflow-hidden shadow-sm">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover"
              loading="lazy"
              data-testid="recipe-image"
            />
          ) : (
            <div
              className="border border-gray-200 rounded-xl w-full h-full flex items-center justify-center bg-white"
              data-testid="no-image-placeholder"
            >
              <span className="text-gray-400">Recipe Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mb-6 px-2" data-testid="recipe-content">
        <div className="hidden sm:flex justify-between items-start mb-1">
          <h2
            className="text-xl font-semibold text-gray-900 flex-1 mr-4"
            data-testid="recipe-title"
          >
            {recipe.name}
          </h2>
          <TimerBadge minutes={recipe.duration_minutes} />
        </div>

        <div className="hidden sm:flex justify-between items-center">
          {recipe.description && (
            <p
              className="text-gray-600 text-base flex-1 mr-4"
              data-testid="recipe-description"
            >
              {recipe.description}
            </p>
          )}
          {recipe.category ? (
            <p
              className="text-[#F37A7E] text-sm font-medium whitespace-nowrap"
              data-testid="recipe-category"
            >
              {recipe.category}
            </p>
          ) : (
            <span />
          )}
        </div>

        <div className="sm:hidden">
          <h2
            className="text-lg font-semibold text-gray-900 mb-2 text-center"
            data-testid="recipe-title-mobile"
          >
            {recipe.name}
          </h2>

          {recipe.description && (
            <p
              className="text-gray-600 text-sm mb-3 text-center"
              data-testid="recipe-description-mobile"
            >
              {recipe.description}
            </p>
          )}

          <div className="flex justify-between items-center">
            {recipe.category ? (
              <p
                className="text-[#F37A7E] text-xs font-medium whitespace-nowrap"
                data-testid="recipe-category-mobile"
              >
                {recipe.category}
              </p>
            ) : (
              <span />
            )}
            <TimerBadge minutes={recipe.duration_minutes} />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mb-8 gap-20">
        <Button
          onClick={handleSkip}
          aria-label="Saltar receta"
          hoverColor="hover:bg-gray-300"
          className="px-2 py-2 rounded-full hover:border-gray-500 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border-1 border-gray-300"
        >
          <IoMdClose size={28} color="#6B7280" />
        </Button>
        <Button
          onClick={handleFavoriteToggle}
          aria-label="Agregar a Favoritos"
          hoverColor="hover:bg-rose-100"
          className="px-3  py-2 rounded-full bg-white shadow-md hover:shadow-lg hover:border-accent transition-shadow duration-200 border-1 border-gray-300"
        >
          <BsBookmarkFill size={20} color="#F37A7E" />
        </Button>
      </div>

      <div
        className="w-full sm:max-w-[140px] mx-auto mb-2"
        data-testid="open-recipe-button-wrapper"
      >
        <Button
          onClick={() => navigate(`/recipe/${recipe.id}`)}
          type="button"
          className="w-full px-4 py-2 rounded-lg"
          aria-label="Ver receta"
        >
          Ver receta
        </Button>
      </div>
    </div>
  );
};

export default SwipeCard;
