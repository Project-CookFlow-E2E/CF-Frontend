/**
 * @file Profile.jsx
 * @description Página de perfil de usuario que muestra recetas guardadas (favoritas) y recetas creadas por el usuario.
 * Incluye paginación, navegación por pestañas y control de favoritos almacenados en localStorage.
 *
 * Funcionalidades:
 * - Alternancia entre recetas guardadas y creadas por el usuario.
 * - Visualización paginada de recetas (8 por página).
 * - Posibilidad de marcar/desmarcar recetas como favoritas.
 * - Muestra información del usuario con nombre y descripción.
 *
 * Componentes utilizados:
 * - Card: Vista individual de receta con botón de favorito.
 * - Pagination: Control de cambio de página.
 * - useProfileRecipes: Hook para gestionar lógica de perfil y recetas.
 *
 * @module pages/Profile
 * @modifiedby Ana Castro
 * @modified Adaptación del componente Card.jsx para usarlo directamente, gestión de favoritos y recetas propias a través del hook useProfileRecipes.
 * @modifiedby Ángel Aragón
 * @modified Agregado cursor-pointer a los botones de las pestañas.
 */

import useProfileRecipes from "../hooks/useProfileRecipes";
import { Card, Pagination } from "../components";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    favorites,
    toggleFavorite,
    createdRecipesCount,
    totalPages,
    paginatedRecipes,
    filteredRecipes,
  } = useProfileRecipes();

  return (
    <div className="min-h-screen bg-background" data-testid="profile-page">
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">
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

        <div className="flex space-x-4 mb-6" data-testid="profile-tabs">
          <button
            onClick={() => setActiveTab("saved")}
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
            onClick={() => setActiveTab("created")}
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
                {paginatedRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    id={recipe.id}
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
            </div>
          </div>
        </div>

        {filteredRecipes.length === 0 && (
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

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            data-testid="pagination"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
