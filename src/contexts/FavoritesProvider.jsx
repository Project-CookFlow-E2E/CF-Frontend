import { useContext, useState } from 'react';
import FavoritesContext from './FavoritesContext';

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(new Set());
  const isLoading = false;

  const toggleFavorite = (recipeId) => {
    const id = String(recipeId);
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
        console.log('❌ Removed from favorites:', id);
      } else {
        updated.add(id);
        console.log('✅ Added to favorites:', id);
      }
      return updated;
    });
  };

  const isFavorite = (recipeId) => favorites.has(String(recipeId));
  const getFavoriteCount = () => favorites.size;

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    isLoading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
