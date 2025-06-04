import React, { useState } from 'react';
import RecipeCard from '../components/cards/RecipeCard';
import mockRecipes from '../data/mockRecipes';

const InspireMe = () => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  
  const currentRecipe = recipes[currentRecipeIndex];

  const handleLike = () => {
    setRecipes(prev => prev.map((recipe, idx) => 
      idx === currentRecipeIndex ? {...recipe, is_favorite: true} : recipe
    ));
    goToNextRecipe();
  };

  const handleDislike = () => {
    goToNextRecipe();
  };

  const goToNextRecipe = () => {
    setCurrentRecipeIndex(prev => (prev >= recipes.length - 1) ? 0 : prev + 1);
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FDF3E8' }}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 text-gray-900">
          Swipe the Dish
        </h1>
        <RecipeCard 
          recipe={currentRecipe} 
          onLike={handleLike}
          onDislike={handleDislike}
        />
      </div>
    </div>
  );
};

export default InspireMe;
