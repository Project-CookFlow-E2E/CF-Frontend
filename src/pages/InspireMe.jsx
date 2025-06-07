import { useState } from 'react';
import SwipeCard from '../components/cards/SwipeCard';
import { mockRecipes } from '../data/mockData';
import useRecipe from '../hooks/useRecipe';

const InspireMe = () => {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const currentRecipeId = mockRecipes[currentRecipeIndex]?.id;
  const { recipe, loading } = useRecipe(currentRecipeId);

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

  const handleSkip = () => {
    goToNextRecipe();
  };

  const goToNextRecipe = () => {
    setCurrentRecipeIndex(prev =>
      prev >= mockRecipes.length - 1 ? 0 : prev + 1
    );
  };

  if (!mockRecipes.length) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        data-testid="no-recipes-message"
      >
        <p>No recipes available.</p>
      </div>
    );
  }

  if (loading || !recipe) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-state"
      >
        <div 
          className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg"
          id="loading-placeholder"
        ></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4" 
      style={{ backgroundColor: '#FDF3E8' }} 
      data-testid="inspire-me-page"
      id="inspire-me-container"
    >
      <div className="max-w-md mx-auto">
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 text-gray-900"
          data-testid="page-title"
          id="inspire-title"
        >
          Swipe the Dish
        </h1>
        <SwipeCard
          recipe={{
            ...recipe,
            is_favorite: favorites.includes(String(recipe.id)),
          }}
          onToggleFavorite={handleToggleFavorite}
          onSkip={handleSkip}
          data-testid="swipe-card"
          id="swipe-card"
        />
      </div>
    </div>
  );
};

export default InspireMe;
