// import { useState, useEffect } from 'react';
// import Card from '../components/Card';
// import { mockRecipes } from '../data/mockData';
// import { useFavorites } from '../contexts/FavoritesProvider.jsx';
// import Pagination from '../components/ui/Pagination.jsx';

// // Main Profile component
// const Profile = () => {
//   const [activeTab, setActiveTab] = useState('saved'); 
//   const [currentPage, setCurrentPage] = useState(1);
//   const recipesPerPage = 8;
  
//   const { toggleFavorite, isFavorite, getFavoriteCount, isLoading } = useFavorites();

//   // Filter recipes based on the active tab
//   const filteredRecipes = mockRecipes.filter(recipe => {
//     if (activeTab === 'saved') {
//       return isFavorite(recipe.id);
//     } else {
//       // For "created" recipes, you can add a field like isCreatedByUser to mockData
//       // For now, we'll use user_id === 1 (assuming current user has ID 1)
//       return recipe.user_id === 1;
//     }
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
//   const startIndex = (currentPage - 1) * recipesPerPage;
//   const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

//   // Reset current page when the active tab changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Get count of user's created recipes
//   const createdRecipesCount = mockRecipes.filter(r => r.user_id === 1).length;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Cargando recetas...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">
//         {/* Profile Section */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-6 mb-4">
//             <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
//               <span className="text-3xl text-gray-500">👤</span>
//             </div>
//             <h2 className="text-3xl font-bold">Emma González</h2>
//           </div>
//           <div className="max-w-3xl">
//             <p className="text-gray-600">
//               Emma González es editora adjunta en Cheffly, y aporta su experiencia
//               como expeditora de cocina en The Los Angeles Times. También es una
//               autora reconocida, con contribuciones a numerosos libros de cocina y
//               publicaciones gastronómicas. Originaria del Este de Los Angeles, Emma
//               reside ahora en la ciudad de Nueva York, donde explora una amplia
//               variedad de delicias culinarias.
//             </p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex space-x-4 mb-6">
//           <button
//             onClick={() => handleTabChange('saved')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               activeTab === 'saved'
//                 ? 'bg-gray-800 text-white'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             Recetas guardadas ({getFavoriteCount()})
//           </button>
//           <button
//             onClick={() => handleTabChange('created')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               activeTab === 'created'
//                 ? 'bg-gray-800 text-white'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             Mis Recetas ({createdRecipesCount})
//           </button>
//         </div>

//         {/* Recipes Grid */}
//         <div className="flex justify-center">
//           <div className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-center">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[10px] gap-y-10">
//                 {currentRecipes.map(recipe => (
//                   <Card
//                     key={recipe.id}
//                     id={recipe.id}
//                     image={recipe.image_url}
//                     name={recipe.name}
//                     category={recipe.category}
//                     time={`${recipe.duration_minutes} m`}
//                     isFavorite={isFavorite(recipe.id)}
//                     onToggleFavorite={toggleFavorite}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Empty State */}
//         {filteredRecipes.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">
//               {activeTab === 'saved' ? '🔖' : '👨‍🍳'}
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               {activeTab === 'saved' 
//                 ? 'No tienes recetas guardadas' 
//                 : 'No has creado recetas aún'
//               }
//             </h3>
//             <p className="text-gray-500">
//               {activeTab === 'saved'
//                 ? 'Guarda tus recetas favoritas haciendo clic en el marcador'
//                 : 'Comienza a crear tus propias recetas deliciosas'
//               }
//             </p>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;