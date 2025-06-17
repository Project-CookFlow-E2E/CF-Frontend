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

import { useState, useEffect } from 'react';
import SwipeCard from '../components/SwipeCard';
import { recipeService } from '../services/recipeService';
import { favoriteService } from '../services/favoriteService';

const InspireMe = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userFavoriteEntries, setUserFavoriteEntries] = useState([]); 
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  useEffect(() => {
    const fetchInitialRecipes = async () => {
      setInitialLoading(true);
      try {
        const fetchedRecipes = await recipeService.getRandomRecipes(2); // Or 5
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("InspireMe: Error fetching random recipes:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialRecipes();
  }, []);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      setFavoritesLoading(true);
      try {
        const fetchedFavoriteEntries = await favoriteService.getUserFavorites(); 
        setUserFavoriteEntries(fetchedFavoriteEntries);
      } catch (error) {
        console.error("InspireMe: Error loading user favorites:", error);
      } finally {
        setFavoritesLoading(false);
      }
    };
    fetchUserFavorites();
  }, []); 

  const currentRecipe = recipes[currentRecipeIndex];

  const handleToggleFavorite = async (recipeId) => {
    const idNum = Number(recipeId);
    const favoriteEntry = userFavoriteEntries.find(entry => entry.recipe_id === idNum);
    const isFavorite = !!favoriteEntry;

    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(favoriteEntry.id); 
        setUserFavoriteEntries(prevEntries => 
          prevEntries.filter(entry => entry.recipe_id !== idNum)
        );
        console.log(`InspireMe: Recipe ${idNum} removed from favorites.`);
      } else {
        const newFavorite = await favoriteService.addFavorite(idNum); 
        setUserFavoriteEntries(prevEntries => [...prevEntries, newFavorite]);
        console.log(`InspireMe: Recipe ${idNum} added to favorites. New favorite entry:`, newFavorite);
      }
      goToNextRecipe();
    } catch (error) {
      console.error("InspireMe: Error toggling favorite:", error);
    }
  };

  const handleSkip = () => {
    goToNextRecipe();
  };

  const goToNextRecipe = () => {
    setCurrentRecipeIndex(prev => {
      const nextIndex = prev >= recipes.length - 1 ? 0 : prev + 1;
      return nextIndex;
    });
  };

  if (initialLoading || favoritesLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-state"
      >
        <div
          className="animate-pulse bg-gray-200 h-64 w-80 rounded-lg"
          id="loading-placeholder"
        ></div>
        <p className="ml-4 text-gray-700">Loading recipes and your favorites...</p>
      </div>
    );
  }

  if (!recipes.length) {
    console.log("InspireMe: Rendering 'no recipes available' state.");
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-testid="no-recipes-message"
      >
        <p>No recipes available. Please try again later.</p>
      </div>
    );
  }

  if (!currentRecipe) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p>Error: Recipe not available to display.</p>
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
            ...currentRecipe,
            is_favorite: userFavoriteEntries.some(entry => entry.recipe_id === currentRecipe.id),
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