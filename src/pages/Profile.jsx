/**
 * @file Profile.jsx
 * @description Página de perfil de usuario que muestra recetas guardadas (favoritas) y recetas creadas por el usuario.
 * Incluye paginación, navegación por pestañas y control de favoritos almacenados en localStorage.
 *
 * Funcionalidades:
 * - Alternancia entre recetas guardadas y creadas por el usuario.
 * - Visualización paginada de recetas (8 por página).
 * - Posibilidad de marcar/desmarcar recetas como favoritas.
 * - Muestra información del usuario con nombre y descripción.
 *
 * Componentes utilizados:
 * - Card: Vista individual de receta con botón de favorito.
 * - Pagination: Control de cambio de página.
 * - useProfileRecipes: Hook para gestionar lógica de perfil y recetas.
 *
 * @module pages/Profile
 * @modifiedby Ana Castro
 * @modified Adaptación del componente Card.jsx para usarlo directamente, gestión de favoritos y recetas propias a través del hook useProfileRecipes.
 * @modifiedby Ángel Aragón
 * @modified Agregado cursor-pointer a los botones de las pestañas.
 * @modifiedby Lorena Martínez, Saray Miguel
 * @modified Añadida funcionalidad de edición de biografía del usuario y petición al backend para obtener información del usuario autenticado.
 */

import { useState, useEffect } from "react";
import useFavorites from "../hooks/useFavorites";
import useProfileRecipes from "../hooks/useProfileRecipes";
import { userService } from "../services/userService";
import { Card, Pagination } from "../components";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);

  const { favorites, loading: favLoading } = useFavorites();
  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    paginatedRecipes,
    totalPages,
    filteredRecipes,
    toggleFavorite,
  } = useProfileRecipes();

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const data = await userService.getMe();
      setUser(data);
      setBio(data.biography || "");
    };
    fetchUser();
  }, []);

  const handleBioSave = async () => {
    setBioLoading(true);
    await userService.updateMe({ biography: bio });
    setEditingBio(false);
    setBioLoading(false);
  };

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil de {user.name}</h2>
      <div className="mb-4">
        <div><strong>Nombre de usuario:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div className="mt-2">
          <strong>Biografía:</strong>
          {editingBio ? (
            <div>
              <textarea
                className="border rounded w-full p-2 mt-1"
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded mt-2 mr-2"
                onClick={handleBioSave}
                disabled={bioLoading}
              >
                Guardar
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded mt-2"
                onClick={() => setEditingBio(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">{user.biography || "Sin biografía."}</span>
              <button
                className="text-blue-600 underline"
                onClick={() => setEditingBio(true)}
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <button
          className={`mr-4 ${activeTab === "saved" ? "font-bold underline" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Recetas favoritas ({favorites.length})
        </button>
        <button
          className={activeTab === "created" ? "font-bold underline" : ""}
          onClick={() => setActiveTab("created")}
        >
          Recetas creadas ({filteredRecipes.length})
        </button>
      </div>

      <div>
        {favLoading ? (
          <div>Cargando recetas...</div>
        ) : paginatedRecipes.length === 0 ? (
          <div>No hay recetas para mostrar.</div>
        ) : (
          <ul>
            {paginatedRecipes.map((recipe) => (
              <li key={recipe.id} className="mb-2 flex justify-between items-center border-b pb-2">
                <span>{recipe.name}</span>
                <button
                  className={`ml-2 ${favorites.includes(String(recipe.id)) ? "text-yellow-500" : "text-gray-400"}`}
                  onClick={() => toggleFavorite(recipe.id)}
                  title="Favorito"
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Profile;
