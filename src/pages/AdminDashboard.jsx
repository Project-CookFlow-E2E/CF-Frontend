/**
 * @file AdminDashboard.jsx
 * @description
 * Página principal del panel de administración de CookFlow.
 * Permite a los administradores navegar y gestionar recetas, usuarios, categorías e ingredientes desde un único panel.
 *
 * Funcionalidades principales:
 * - Sidebar de navegación para acceder a las diferentes secciones de administración.
 * - Renderizado dinámico de los componentes de gestión según la sección seleccionada.
 * - Vista de panel de control con mensaje de bienvenida y espacio para estadísticas/resúmenes.
 *
 * Estados:
 * - activeSection: controla la sección activa del dashboard ('dashboard', 'recipes', 'users', 'categories', 'ingredients').
 *
 * Componentes utilizados:
 * - RecipeManagement: gestión de recetas.
 * - UserManagement: gestión de usuarios.
 * - CategoryManagement: gestión de categorías.
 * - IngredientManagement: gestión de ingredientes.
 *
 * Uso:
 * Esta página está pensada para ser usada por administradores.
 * Permite gestionar todo el contenido relevante de la plataforma desde un solo lugar, con navegación lateral y renderizado condicional del contenido.
 *
 * @author
 * Rubén Ortega
 */

import React, { useState } from 'react';



import RecipeManagement from '../components/admin/RecipeManagement';
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import IngredientManagement from '../components/admin/IngredientManagement';

const AdminDashboard = () => {

  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Panel de Control</h2>
            <p className="text-gray-600">Bienvenido al panel de administración. Selecciona una opción del menú lateral para gestionar el contenido de CookFlow.</p>

          </div>
        );
      case 'recipes':
        return <RecipeManagement />;
      case 'users':
        return <UserManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'ingredients':
        return <IngredientManagement />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Panel de Administración</h2>
            <p className="text-gray-600">Bienvenido al panel de administración.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800"> Administrador</h1>
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <button
                className={`flex items-center p-2 rounded-md w-full text-left ${activeSection === 'dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveSection('dashboard')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Panel de control
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center p-2 rounded-md w-full text-left ${activeSection === 'recipes' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveSection('recipes')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.024 1.408L6.4 7.618a1 1 0 01-1.424 0L2.105 4.438A1 1 0 013.52 3.014l3.149 3.15 2.574-2.574zM10.757 16.97a1 1 0 01-.024-1.408l2.868-3.18a1 1 0 011.424 0l3.871 3.181a1 1 0 01-1.424 1.408l-3.149-3.15-2.574 2.574z" clipRule="evenodd" />
                </svg>
                Recetas
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center p-2 rounded-md w-full text-left ${activeSection === 'users' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveSection('users')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Usuarios
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center p-2 rounded-md w-full text-left ${activeSection === 'categories' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveSection('categories')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm1.475 2.102a.75.75 0 00-.974 1.185L8 12.197l5.474-5.91a.75.75 0 00-.974-1.185L8 9.803l-3.475-3.701z" clipRule="evenodd" />
                </svg>
                Categorias
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`flex items-center p-2 rounded-md w-full text-left ${activeSection === 'ingredients' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveSection('ingredients')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm3.5 1h-3a.5.5 0 000 1h3a.5.5 0 000-1z" clipRule="evenodd" />
                </svg>
                Ingredientes
              </button>
            </li>
          </ul>
        </nav>

      </div>


      <div className="flex-1 p-8 bg-gray-100">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;