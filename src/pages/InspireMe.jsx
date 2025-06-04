import { useState } from 'react';
import RecipeCard from '../components/cards/RecipeCard';
import { mockRecipes } from '../data/mockData';
import { useFavorites } from '../contexts/FavoritesProvider.jsx';

const InspireMe = () => {
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();

  const currentRecipe = mockRecipes[currentRecipeIndex];

  const handleToggleFavorite = (recipeId) => {
    toggleFavorite(recipeId);
    // Move to next recipe after favoriting
    goToNextRecipe();
  };

  const handleSkip = () => {
    goToNextRecipe();
  };

  const goToNextRecipe = () => {
    setCurrentRecipeIndex(prev => (prev >= mockRecipes.length - 1) ? 0 : prev + 1);
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FDF3E8' }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 text-gray-900">
          Swipe the Dish
        </h1>
        <RecipeCard
          recipe={{
            ...currentRecipe,
            is_favorite: isFavorite(currentRecipe.id)
          }}
          onToggleFavorite={handleToggleFavorite}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default InspireMe;