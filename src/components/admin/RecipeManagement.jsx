/**
 * @file RecipeManagement.jsx
 * @description
 * Componente de administración de recetas para el panel de administración.
 * Permite visualizar, buscar, editar y gestionar recetas.
 *
 * Funcionalidades principales:
 * - Listar todas las recetas existentes.
 * - Buscar recetas por nombre mediante un input de búsqueda.
 * - Editar el nombre y la categoría de una receta mediante un modal.
 * - Botón para añadir nuevas recetas (funcionalidad pendiente de implementar).
 * - Acciones de edición y borrado para cada receta.
 * - Paginación: muestra 5 recetas por página, con navegación entre páginas.
 * - Ordena las recetas de la más reciente a la más antigua según la fecha de creación.
 *
 * Estados:
 * - recipes: array de recetas obtenidas del backend.
 * - loading: booleano para mostrar el estado de carga.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición.
 * - page: página actual de la paginación.
 * - search: término de búsqueda para filtrar recetas por nombre.
 *
 * Servicios utilizados:
 * - recipeService.getRecipes(): obtiene todas las recetas.
 * - recipeService.updateRecipeAdmin(id, data): actualiza una receta.
 *
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite buscar y modificar los campos "Nombre" y "Categoría" de cada receta,
 * navegar entre páginas y ver las recetas ordenadas por fecha de creación.
 *
 * @author
 * Lorena Martínez, Noemi Casaprima
 */

import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";

const PAGE_SIZE = 5;

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState({ open: false, recipe: null });
  const [editForm, setEditForm] = useState({ name: "", category: "" });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await recipeService.getRecipes();

        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRecipes(sorted);
      } catch (error) {
        {
          error;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const openEditModal = (recipe) => {
    setEditForm({
      name: recipe.name || "",
      category: recipe.category || "",
    });
    setEditModal({ open: true, recipe });
  };

  const closeEditModal = () => setEditModal({ open: false, recipe: null });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editModal.recipe.id;
    const updatedData = {
      name: editForm.name,
      category: editForm.category,
    };
    await recipeService.updateRecipeAdmin(id, updatedData);
    setRecipes((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updatedData } : rec))
    );
    closeEditModal();
  };

 
  const filteredRecipes = recipes.filter((rec) =>
    rec.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);
  const paginatedRecipes = filteredRecipes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Administrador de recetas
        </h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Añadir nueva receta
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar recetas..."
          className="border px-3 py-2 rounded w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Nombre
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Autor
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Categoría
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Fecha de creación
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Fecha de actualización
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : paginatedRecipes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No se encontraron recetas.
                </td>
              </tr>
            ) : (
              paginatedRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {recipe.name}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {recipe.user || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {recipe.category || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {recipe.created_at || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {recipe.updated_at || "-"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      Ver
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                      onClick={() => openEditModal(recipe)}
                    >
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button
          className="px-3 py-1 border rounded-md mr-1"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded-md"
          onClick={handleNext}
          disabled={page === totalPages || totalPages === 0}
        >
          Siguiente
        </button>
      </div>

      {editModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Editar Receta</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Nombre de la receta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Categoría"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeManagement;
