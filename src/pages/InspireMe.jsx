/**
 * @file InspireMe.jsx
 * @description Página de inspiración culinaria tipo "Tinder de recetas".
 * Permite a los usuarios ver recetas una por una y marcarlas como favoritas o saltarlas.
 * Utiliza datos simulados (`mockRecipes`) y gestiona favoritos en `localStorage`.
 * 
 * El componente `SwipeCard` representa visualmente cada receta con acciones de swipe.
 * 
 * 👉 Este flujo puede adaptarse fácilmente a datos reales desde el backend.
 * 
 * @module pages/InspireMe
 */

import { useState } from 'react';
import SwipeCard from '../components/cards/SwipeCard';
import { mockRecipes } from '../data/mockData';
import useRecipe from '../hooks/useRecipe';

const InspireMe = () => {
  // Estado para el índice actual de receta
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  // Estado local para favoritos, cargado desde localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // ID de la receta actual según el índice
  const currentRecipeId = mockRecipes[currentRecipeIndex]?.id;
  const { recipe, loading } = useRecipe(currentRecipeId);

  /**
   * Añade o quita una receta de la lista de favoritos
   * y pasa automáticamente a la siguiente receta.
   * @param {number} recipeId - ID de la receta a marcar o desmarcar como favorita
   */
  const handleToggleFavorite = (recipeId) => {
    const idStr = String(recipeId);
    const isFavorite = favorites.includes(idStr);
    const updated = isFavorite
      ? favorites.filter(fav => fav !== idStr)
      : [...favorites, idStr];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    goToNextRecipe();
  };

  /**
   * Salta a la siguiente receta sin marcar como favorita.
   */
  const handleSkip = () => {
    goToNextRecipe();
  };

  /**
   * Lógica para avanzar al siguiente índice de receta.
   * Si se llega al final del array, vuelve al inicio (loop).
   */
  const goToNextRecipe = () => {
    setCurrentRecipeIndex(prev =>
      prev >= mockRecipes.length - 1 ? 0 : prev + 1
    );
  };

  // Muestra si no hay recetas disponibles
  if (!mockRecipes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No recipes available.</p>
      </div>
    );
  }

  // Estado de carga
  if (loading || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg"></div>
      </div>
    );
  }

  // Renderiza la receta actual con SwipeCard
  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FDF3E8' }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 text-gray-900">
          Swipe the Dish
        </h1>
        <SwipeCard
          recipe={{
            ...recipe,
            is_favorite: favorites.includes(String(recipe.id)),
          }}
          onToggleFavorite={handleToggleFavorite}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default InspireMe;
