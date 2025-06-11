/**
 * @file Profile.jsx
 * @description Página de perfil de usuario que muestra recetas guardadas (favoritos) y recetas creadas por el usuario.
 * Incluye paginación, tabs de navegación y control de favoritos almacenados en localStorage.
 *
 * Funcionalidades:
 * - Alternancia entre recetas guardadas y creadas por el usuario.
 * - Visualización paginada de recetas (8 por página).
 * - Posibilidad de marcar/desmarcar recetas como favoritas.
 *
 * Componentes usados:
 * - Card: para mostrar cada receta.
 * - Pagination: control de cambio de página.
 * - useRecipe: hook que obtiene los detalles de una receta por ID.
 * - mockRecipes: datos simulados de recetas.
 *
 * @module pages/Profile
 */

import { useState, useEffect } from "react";
import useRecipe from "../hooks/useRecipe";
import { mockRecipes } from "../data/mockData";
import { Card, Pagination } from "../components";

/**
 * Componente para renderizar una tarjeta de receta individual con funcionalidad de favoritos.
 *
 * @param {Object} props
 * @param {number} props.id - ID de la receta a mostrar.
 * @param {string[]} props.favorites - Lista de IDs marcados como favoritos.
 * @param {Function} props.setFavorites - Función para actualizar favoritos.
 * @returns {JSX.Element}
 */
const RecipeCard = ({ id, favorites, setFavorites }) => {
  const { recipe, loading } = useRecipe(id);
  const isFavorite = favorites.includes(String(id));

  const handleToggleFavorite = () => {
    const idStr = String(id);
    const updated = isFavorite
      ? favorites.filter((fav) => fav !== idStr)
      : [...favorites, idStr];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading)
    return (
      <div
        className="animate-pulse bg-gray-200 h-64 rounded-lg"
        data-testid={`recipe-loading-${id}`}
      ></div>
    );
  if (!recipe) return null;

  return (
    <Card
      id={recipe.id}
      image={recipe.image_url}
      name={recipe.name}
      category={recipe.category}
      time={`${recipe.duration_minutes}`}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      data-testid={`recipe-card-${recipe.id}`}
      favorite-testid={isFavorite ? "favorite-true" : "favorite-false"}
    />
  );
};

/**
 * Página de perfil del usuario.
 * Permite al usuario ver sus recetas guardadas y las creadas, con navegación por pestañas y paginación.
 *
 * @returns {JSX.Element}
 */
const Profile = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const recipesPerPage = 8;

  const filteredRecipes = mockRecipes.filter((recipe) => {
    if (activeTab === "saved") {
      return favorites.includes(String(recipe.id));
    } else {
      return recipe.isCreatedByUser;
    }
  });

  const filteredRecipeIds = filteredRecipes.map((recipe) => recipe.id);
  const totalPages = Math.ceil(filteredRecipeIds.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipeIds = filteredRecipeIds.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const createdRecipesCount = mockRecipes.filter(
    (recipe) => recipe.isCreatedByUser
  ).length;

  return (
    <div className="min-h-screen bg-background" data-testid="profile-page">
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">
        {/* Profile Section */}
        <div className="mb-8" data-testid="profile-section">
          <div className="flex items-center space-x-6 mb-4">
            <div
              className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center"
              data-testid="profile-avatar"
            >
              <span className="text-3xl text-gray-500">👤</span>
            </div>
            <h2 className="text-3xl font-bold" data-testid="profile-name">
              Emma González
            </h2>
          </div>
          <div className="max-w-3xl" data-testid="profile-description">
            <p className="text-gray-600">
              Emma González es editora adjunta en Cheffly, y aporta su
              experiencia como expeditora de cocina en The Los Angeles Times.
              También es una autora reconocida, con contribuciones a numerosos
              libros de cocina y publicaciones gastronómicas. Originaria del
              Este de Los Angeles, Emma reside ahora en la ciudad de Nueva York,
              donde explora una amplia variedad de delicias culinarias.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6" data-testid="profile-tabs">
          <button
            onClick={() => handleTabChange("saved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "saved"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-testid="tab-saved"
            aria-selected={activeTab === "saved"}
          >
            Recetas guardadas ({favorites.length})
          </button>
          <button
            onClick={() => handleTabChange("created")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "created"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-testid="tab-created"
            aria-selected={activeTab === "created"}
          >
            Mis Recetas ({createdRecipesCount})
          </button>
        </div>

        {/* Recipes Grid */}
        <div
          className="flex justify-center"
          data-testid="recipes-grid-container"
        >
          <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[10px] gap-y-10"
                data-testid="recipes-grid"
              >
                {currentRecipeIds.map((id) => (
                  <RecipeCard
                    key={id}
                    id={id}
                    favorites={favorites}
                    setFavorites={setFavorites}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Estado vacío si no hay recetas */}
        {filteredRecipeIds.length === 0 && (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="text-6xl mb-4" data-testid="empty-state-icon">
              {activeTab === "saved" ? "🔖" : "👨‍🍳"}
            </div>
            <h3
              className="text-xl font-semibold text-gray-700 mb-2"
              data-testid="empty-state-title"
            >
              {activeTab === "saved"
                ? "No tienes recetas guardadas"
                : "No has creado recetas aún"}
            </h3>
            <p className="text-gray-500" data-testid="empty-state-description">
              {activeTab === "saved"
                ? "Guarda tus recetas favoritas haciendo clic en el marcador"
                : "Comienza a crear tus propias recetas deliciosas"}
            </p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            data-testid="pagination"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
