import { useState } from 'react';
import SwipeCard from '../components/cards/SwipeCard';
import { mockRecipes } from '../data/mockData';
import useRecipe from '../hooks/useRecipe';

const InspireMe = () => {
  // Local state for recipe index
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  // Local state for favorites, initialized from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const currentRecipeId = mockRecipes[currentRecipeIndex]?.id;
  const { recipe, loading } = useRecipe(currentRecipeId);

  // Toggle favorite status and update localStorage
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

  // Skip to next recipe
  const handleSkip = () => {
    goToNextRecipe();
  };

  // Go to next recipe (loop to start if at end)
  const goToNextRecipe = () => {
    setCurrentRecipeIndex(prev =>
      prev >= mockRecipes.length - 1 ? 0 : prev + 1
    );
  };

  // If there are no recipes, show a message
  if (!mockRecipes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No recipes available.</p>
      </div>
    );
  }

  // Loading state
  if (loading || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg"></div>
      </div>
    );
  }

  // Render the swipe card
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
