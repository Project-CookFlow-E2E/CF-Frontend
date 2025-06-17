/**
 * @file Profile.jsx
 * @description Página de perfil de usuario
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
  
  // Foto de perfil
  const [profileImg, setProfileImg] = useState(null);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);

  // Usando el hook modificado de favoritos
  const { 
    favorites, 
    favoriteRecipes, 
    loading: loadingFavorites, 
    toggleFavorite 
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

  // Cargar datos del usuario y su foto de perfil
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
    window.location.reload(); 
    setEditingBio(false);
    setBioLoading(false);
  };

  const handleImgSave = async () => {
    if (!imgFile) return;
    setImgLoading(true);
    try {
      await imageService.updateProfileImage(imgFile);
      window.location.reload();
      setImgModalOpen(false);
      setImgFile(null);
    } finally {
      setImgLoading(false);
    }
  };

  const handleImgDelete = async () => {
    if (!profileImg) return;
    setImgLoading(true);
    try {
      await imageService.deleteImage(user.id, USER_TYPE);
      setProfileImg(null);
      setImgModalOpen(false);
      setImgFile(null);
    } finally {
      setImgLoading(false);
    }
  };

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil de {user.name}</h2>
      
      {/* Sección de información del usuario */}
      <div className="flex items-center mb-4">
        <div className="relative">
          <img
            src={
              profileImg?.url
              ? "http://localhost:8000/media/img/" + user.id + "/" + profileImg.url
              : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)

            }
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700"
            onClick={() => setImgModalOpen(true)}
            title="Editar foto de perfil"
          >
            ✎
          </button>
        </div>
        <div className="ml-6">
          <div><strong>Nombre de usuario:</strong> {user.username}</div>
          <div><strong>Email:</strong> {user.email}</div>
        </div>
      </div>
      
      {/* Biografía */}
      <div className="mb-4">
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

      
      {imgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-0">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setImgModalOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-6 text-center">Editar foto de perfil</h3>
            <div className="flex flex-col items-center">
                   <img
            src={
              profileImg?.url
              ? "http://localhost:8000/media/img/" + user.id + "/" + profileImg.url
              : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)

            }
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border"
          />
              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg border border-blue-200 transition mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M7 7v.01M7 7a5 5 0 017.071 0l.707.707a5 5 0 010 7.071l-6.586 6.586a5 5 0 01-7.071-7.071l.707-.707A5 5 0 017 7z" />
                </svg>
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImgFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  onClick={handleImgSave}
                  disabled={imgLoading || !imgFile}
                >
                  {profileImg ? "Actualizar" : "Subir"}
                </button>
                {profileImg && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
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

      {/* Pestañas de recetas */}
      <div className="mb-6">
        <button
          className={`mr-4 ${activeTab === "saved" ? "font-bold underline" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Recetas favoritas ({favoriteRecipes.length})
        </button>
        <button
          className={activeTab === "created" ? "font-bold underline" : ""}
          onClick={() => setActiveTab("created")}
        >
          Recetas creadas ({filteredRecipes.length})
        </button>
      </div>

      {/* Listado de recetas */}
      <div>
        {activeTab === "saved" ? (
          <>
            {loadingFavorites ? (
              <div>Cargando recetas favoritas...</div>
            ) : favoriteRecipes.length === 0 ? (
              <div>No tienes recetas favoritas.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/recetas/${recipe.id}`)}
                  >
                    <Card
                      id={recipe.id}
                      name={recipe.name}
                      image={recipe.image}
                      category={recipe.category}
                      time={recipe.time}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(recipe.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          paginatedRecipes.length === 0 ? (
            <div>No hay recetas para mostrar.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginatedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/recetas/${recipe.id}`)}
                >
                  <Card
                    recipe={recipe}
                    isFavorite={favorites.includes(String(recipe.id))}
                    onToggleFavorite={() => toggleFavorite(recipe.id)}
                  />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Paginación */}
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