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
 * - Subir o actualizar la imagen de perfil del usuario.
 * - Eliminar la imagen de perfil del usuario.
 * - Editar la biografía del usuario autenticado.
 * - Borrar la biografía del usuario.
 *
 * Métodos:
 * - updateProfileImage(imageFile): Sube o actualiza la imagen de perfil del usuario autenticado.
 * - deleteProfileImage(): Elimina la imagen de perfil del usuario autenticado.
 * - updateBiography(bio): Actualiza la biografía del usuario autenticado.
 * - deleteBiography(): Borra la biografía del usuario autenticado.
 *
 * Componentes utilizados:
 * - Card: Vista individual de receta con botón de favorito.
 * - Pagination: Control de cambio de página.
 * - useProfileRecipes: Hook para gestionar lógica de perfil y recetas.
 * - useFavorites: Hook para gestionar favoritos del usuario.
 *
 * @module pages/Profile
 * @modifiedby Ana Castro
 * @modified Adaptación del componente Card.jsx para usarlo directamente, gestión de favoritos y recetas propias a través del hook useProfileRecipes.
 * @modifiedby Ángel Aragón
 * @modified Agregado cursor-pointer a los botones de las pestañas.
 * @modifiedby Lorena Martínez
 * @modified Añadida petición al backend para obtener información del usuario autenticado, funcionalidad de modificar y borrar imagen y biografía del usuario y funcionalidad de edición de biografía del usuario .
 * @modifiedby Saray Miguel
 * @modified Añadida relación con los hooks useFavorites y useProfileRecipes para gestionar favoritos y recetas del perfil.
 */

import { useState, useEffect } from "react";
import useFavorites from "../hooks/useFavorites";
import useProfileRecipes from "../hooks/useProfileRecipes";
import { userService } from "../services/userService";
import { imageService } from "../services/imageService";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

const USER_TYPE = "USER";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);

  const [profileImg, setProfileImg] = useState(null);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);

  const {
    favorites,
    favoriteRecipes,
    loading: loadingFavorites,
    toggleFavorite,
  } = useFavorites();

  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    paginatedRecipes,
    totalPages,
    filteredRecipes,
  } = useProfileRecipes();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await userService.getMe();
      setUser(data);
      setBio(data.biography || "");
      setProfileImg(data.image || null);
    };
    fetchUser();
  }, []);

  const handleBioSave = async () => {
    setBioLoading(true);
    await userService.updateMe({ biography: bio });
    setEditingBio(false);
    setBioLoading(false);
    const data = await userService.getMe();
    setUser(data);
  };

  const handleImgSave = async () => {
    if (!imgFile) return;
    setImgLoading(true);
    try {
      await imageService.updateProfileImage(imgFile);
      const data = await userService.getMe();
      setUser(data);
      setProfileImg(data.image || null);
      setImgModalOpen(false);
      setImgFile(null);
    } finally {
      setImgLoading(false);
    }
  };

  const handleImgDelete = async () => {
    setImgLoading(true);
    try {
      await imageService.deleteProfileImage();
      const data = await userService.getMe();
      setUser(data);
      setProfileImg(null);
      setImgModalOpen(false);
      setImgFile(null);
    } finally {
      setImgLoading(false);
    }
  };

  if (!user) return <div>Cargando perfil...</div>;

  return (
   <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-base font-medium leading-tight">
          {user.name} {user.surname}
        </h2>

        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={
                profileImg?.url
                  ? "http://localhost:8000/media/img/" +
                    user.id +
                    "/" +
                    profileImg.url
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.name)
              }
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <button
              className="absolute bottom-0 right-0 bg-emerald-700 text-white w-8 h-8 rounded-full"
              onClick={() => setImgModalOpen(true)}
              title="Editar foto de perfil"
            >
              ✎
            </button>
          </div>
        </div>

        <div className="mb-4">
          {editingBio ? (
            <div>
              <textarea
                className="border rounded w-full p-2 mt-1"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                className="bg-emerald-700 text-white cursor-pointer px-3 py-1 rounded mt-2 mr-2"
                onClick={handleBioSave}
                disabled={bioLoading}
              >
                Guardar
              </button>
              <button
                className="bg-gray-300 cursor-pointer px-3 py-1 rounded mt-2"
                onClick={() => setEditingBio(false)}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">{user.biography || "Sin biografía."}</span>
              <button
                className="text-blue-600 cursor-pointer underline"
                onClick={() => setEditingBio(true)}
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </div>

      {imgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-0">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 cursor-pointer text-xl"
              onClick={() => setImgModalOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-6 text-center">
              Editar foto de perfil
            </h3>
            <div className="flex flex-col items-center">
              <img
                src={
                  imgFile
                    ? URL.createObjectURL(imgFile)
                    : profileImg?.url
                    ? "http://localhost:8000/media/img/" +
                      user.id +
                      "/" +
                      profileImg.url
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}`
                }
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-2 border-blue-200 mb-5 shadow"
              />
              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg border border-blue-200 transition mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M7 7v.01M7 7a5 5 0 017.071 0l.707.707a5 5 0 010 7.071l-6.586 6.586a5 5 0 01-7.071-7.071l.707-.707A5 5 0 017 7z"
                  />
                </svg>
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImgFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-emerald-700 text-white cursor-pointer px-4 py-2 rounded transition"
                  onClick={handleImgSave}
                  disabled={imgLoading || !imgFile}
                >
                  {profileImg ? "Actualizar" : "Subir"}
                </button>
                {profileImg && (
                  <button
                    className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded transition"
                    onClick={handleImgDelete}
                    disabled={imgLoading}
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-0">
        <button
          className={`px-2 py-2 rounded font-semibold transition-colors ${
            activeTab === "saved"
              ? "bg-red-400 text-white scale-100"
              : "bg-gray-200 text-gray-600 scale-90"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Recetas favoritas ({favoriteRecipes.length})
        </button>
        <button
          className={`px-2 py-2 rounded font-semibold transition-colors ${
            activeTab === "created"
              ? "bg-red-400 text-white scale-100"
              : "bg-gray-200 text-gray-600 scale-90"
          }`}
          onClick={() => setActiveTab("created")}
        >
          Recetas creadas ({filteredRecipes.length})
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 pb-20">
        {activeTab === "saved" ? (
          <>
            {loadingFavorites ? (
              <div>Cargando recetas favoritas...</div>
            ) : favoriteRecipes.length === 0 ? (
              <div>No tienes recetas favoritas.</div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    id={recipe.id}
                    name={recipe.name}
                    image={recipe.image}
                    category={recipe.category}
                    time={recipe.time}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(recipe.id)}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        ) : paginatedRecipes.length === 0 ? (
          <div>No hay recetas para mostrar.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                id={recipe.id}
                name={recipe.name}
                image={recipe.image}
                category={recipe.category}
                time={recipe.time}
                isFavorite={favorites.includes(String(recipe.id))}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
