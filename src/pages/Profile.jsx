import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

// Component of pagination
// It displays the current page, total pages, and allows navigation between pages
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? 'bg-accent text-white'
              : typeof page === 'number'
              ? 'text-gray-600 hover:text-gray-900'
              : 'text-gray-400 cursor-default'
          }`}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
};

// Main Profile component
const Profile = () => {
  const [activeTab, setActiveTab] = useState('saved'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const recipesPerPage = 8;

  // Recipes from recipes.json
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/recipes.json');
        const data = await response.json();
        setRecipes(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading recipes:', error);
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);
// Define the initial favorites from localStorage
useEffect(() => {
  const savedFavorites = localStorage.getItem('favorites');
  console.log('📥 Cargando favoritos de localStorage:', savedFavorites);
  if (savedFavorites) {
    try {
      const parsed = JSON.parse(savedFavorites);
      setFavorites(new Set(parsed.map(String)));
    } catch {
      setFavorites(new Set());
    }
  }
}, []);

// Save favorites to localStorage whenever they change, but only if not loading
useEffect(() => {
  if (!isLoading) {
    console.log('💾 Guardando favoritos en localStorage:', JSON.stringify(Array.from(favorites)));
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }
}, [favorites, isLoading]);

// Filter recipes based on the active tab
const filteredRecipes = recipes.filter(recipe => {
  if (activeTab === 'saved') {
    return favorites.has(String(recipe.id));
  } else {
    return recipe.isCreatedByUser;
  }
});


  // Pagination logic
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

  // Reset current page when the active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

const handleToggleFavorite = (recipeId) => {
  const id = String(recipeId);
  setFavorites(prev => {
    const updated = new Set(prev);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    console.log('⭐ Favoritos actualizados:', Array.from(updated));
    return new Set(updated); // <- nueva instancia
  });
};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando recetas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">
      {/* Profile Section */}
      <div className="mb-8">
          <div className="flex items-center space-x-6 mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl text-gray-500">👤</span>
            </div>
            <h2 className="text-3xl font-bold">Emma González</h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-gray-600">
              Emma González es editora adjunta en Cheffly, y aporta su experiencia
              como expeditora de cocina en The Los Angeles Times. También es una
              autora reconocida, con contribuciones a numerosos libros de cocina y
              publicaciones gastronómicas. Originaria del Este de Los Angeles, Emma
              reside ahora en la ciudad de Nueva York, donde explora una amplia
              variedad de delicias culinarias.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabChange('saved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Recetas guardadas ({recipes.filter(r => favorites.has(String(r.id))).length})
          </button>
          <button
            onClick={() => handleTabChange('created')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'created'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Mis Recetas ({recipes.filter(r => r.isCreatedByUser).length})
          </button>
        </div>

    {/* Recipes Grid */}
<div className="flex justify-center">
  <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[10px] gap-y-10">
        {currentRecipes.map(recipe => (
          <Card
            key={recipe.id}
            id={recipe.id}
            image={recipe.image}
            name={recipe.name}
            category={recipe.category}
            time={recipe.time}
            isFavorite={favorites.has(String(recipe.id))}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  </div>
</div>
        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'saved' ? '🔖' : '👨‍🍳'}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {activeTab === 'saved' 
                ? 'No tienes recetas guardadas' 
                : 'No has creado recetas aún'
              }
            </h3>
            <p className="text-gray-500">
              {activeTab === 'saved'
                ? 'Guarda tus recetas favoritas haciendo clic en el marcador'
                : 'Comienza a crear tus propias recetas deliciosas'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;