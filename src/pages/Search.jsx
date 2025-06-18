/**
 * @file Search.jsx
 * @description Página de búsqueda de recetas. Permite aplicar filtros por categoría, tipo de cocina y origen,
 * además de realizar búsquedas por texto.
 * @author Saray
 * @modified Ana Castro - Refactorización del filtrado a hook personalizado, integración con base de datos
 * para categorías y recetas. Se ha externalizado la lógica de selección automática desde parámetros de URL
 * hacia el hook de filtros.
 * @modified Ángel Áragón - Arreglado favoritos, quitado importaciones innecesarias
 */

import { useState } from "react";
import RecipeFiltersPanel from "../components/RecipeFiltersPanel";
import Card from "../components/Card";
import useRecipeSearch from "../hooks/useRecipeSearch";
import useFavorites from "../hooks/useFavorites";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const {
    loadingAll,
    categories,
    typeCategories,
    originCategories,
    recipesToShow,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedOrigin,
    setSelectedOrigin,
    showingAll,
    toggleMostrarTodo,
  } = useRecipeSearch();

  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const [isOpen, setIsOpen] = useState(true);

  if (loadingAll)
    return <div className="p-6 text-center">Cargando categorías...</div>;

  return (
    <div className="min-h-screen flex flex-col justify-start items-start bg-background px-4 pt-15 lg:px-10">
      <div className="w-full lg:w-1/2 pr-4">
        <h4 className="text-xl font-bold text-black mb-2">
          ¿Qué quieres cocinar?
        </h4>
        <div className="w-full max-w-xl lg:max-w-2xl border border-black rounded-lg mb-10 mt-0 lg:mt-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 px-4 py-3 lg:px-6 lg:py-4 w-full">
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length > 0) {
                  setSelectedCategory([]);
                  setSelectedType([]);
                  setSelectedOrigin([]);
                }
              }}
              className="outline-none w-full bg-transparent text-base lg:text-lg"
            />
            <button
              tabIndex={-1}
              type="button"
              onClick={() => setSearchTerm("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row flex-wrap gap-30 px-0 md:px-4">
        <div className="w-full lg:w-[40%] relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Filtros</span>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Ocultar filtros" : "Mostrar filtros"}
              title={isOpen ? "Ocultar filtros" : "Mostrar filtros"}
              type="button"
            >
              {isOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="5"
                    y="9"
                    width="10"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="9"
                    y="5"
                    width="2"
                    height="10"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="5"
                    y="9"
                    width="10"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>

          {isOpen && (
            <>
              <RecipeFiltersPanel
                general={categories}
                type={typeCategories}
                origin={originCategories}
                selected={{
                  selectedCategory,
                  selectedType,
                  selectedOrigin,
                }}
                setSelected={{
                  setSelectedCategory,
                  setSelectedType,
                  setSelectedOrigin,
                }}
              />
            </>
          )}
        </div>

        <div className="w-full lg:flex-1 mb-10 lg:mt-0">
          <div className="flex justify-between items-center px-1 sm:px-2 mb-4">
            <h4 className="text-xl font-bold text-black">Recetas populares</h4>
            <h4
              className="text-l text-gray-500 cursor-pointer"
              onClick={toggleMostrarTodo}
            >
              {showingAll ? "Ocultar todas" : "Mostrar todas"}
            </h4>
          </div>

          {Array.isArray(recipesToShow) && recipesToShow.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 mt-10 lg:grid-cols-3 gap-x-6 gap-y-10">
              {recipesToShow.map((recipe) => (
                <Card
                  key={recipe.id}
                  id={`recipe-card-${recipe.id}`}
                  image={recipe.image_url}
                  name={recipe.name}
                  category={recipe.category}
                  time={`${recipe.duration_minutes}`}
                  isFavorite={favorites.includes(String(recipe.id))}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 text-lg mt-10 mb-40">
              No hay recetas que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
