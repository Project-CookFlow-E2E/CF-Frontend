/**
 * @file IngredientManagement.jsx
 * @description
 * Componente de administración de ingredientes para el panel de administración.
 * Permite visualizar, buscar, filtrar, aprobar, editar y eliminar ingredientes.
 *
 * Funcionalidades principales:
 * - Listar todos los ingredientes obtenidos del backend.
 * - Filtrar ingredientes por estado (todos, pendientes, aprobados) y por búsqueda.
 * - Aprobar, rechazar/eliminar y editar ingredientes.
 * - Editar ingredientes mediante un modal (nombre, categorías, unidad y estado de aprobación).
 * - Botón para añadir nuevos ingredientes (funcionalidad pendiente de implementar).
 * - Paginación: muestra 5 ingredientes por página, con navegación entre páginas.
 * - Ordena los ingredientes por nombre alfabéticamente.
 *
 * Estados:
 * - ingredients: array de ingredientes obtenidos del backend.
 * - loading: booleano para mostrar el estado de carga.
 * - activeTab: controla el filtro de pestañas (todos, pendientes, aprobados).
 * - search: almacena el texto de búsqueda.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición.
 * - page: página actual de la paginación.
 *
 * Servicios utilizados:
 * - ingredientService.getAllIngredientsAdmin(): obtiene todos los ingredientes.
 * - ingredientService.updateIngredientAdmin(id, data): actualiza un ingrediente.
 * - ingredientService.deleteIngredientAdmin(id): elimina un ingrediente.
 *
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite gestionar ingredientes y su estado de aprobación de forma sencilla.
 *
 * @author
 * Noemi Casaprima, Lorena Martínez
 */

import React, { useState, useEffect } from "react";
import { ingredientService } from "../../services/ingredientService";

const PAGE_SIZE = 5;

const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editModal, setEditModal] = useState({ open: false, ingredient: null });
  const [editForm, setEditForm] = useState({
    name: "",
    categories: "",
    unit_type: "",
    is_approved: false,
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const data = await ingredientService.getAllIngredientsAdmin();
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setIngredients(sorted);
      } catch (error) {
        console.error("Error loading ingredients:", error);
      }
      setLoading(false);
    };
    fetchIngredients();
  }, []);

  const handleApprove = async (id) => {
    await ingredientService.updateIngredientAdmin(id, { is_approved: true });
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, is_approved: true } : ing))
    );
  };

  const handleReject = async (id) => {
    await ingredientService.deleteIngredientAdmin(id);
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleDelete = handleReject;

  const openEditModal = (ingredient) => {
    setEditForm({
      name: ingredient.name || "",
      categories: Array.isArray(ingredient.categories)
        ? ingredient.categories.map((c) => c.name).join(", ")
        : "",
      unit_type: ingredient.unit_type?.name || "",
      is_approved: ingredient.is_approved || false,
    });
    setEditModal({ open: true, ingredient });
  };

  const closeEditModal = () => setEditModal({ open: false, ingredient: null });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editModal.ingredient.id;
    const updatedData = {
      name: editForm.name,
      categories: editForm.categories.split(",").map((s) => s.trim()),
      unit_type: editForm.unit_type,
      is_approved: editForm.is_approved,
    };
    await ingredientService.updateIngredientAdmin(id, updatedData);
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, ...updatedData } : ing))
    );
    closeEditModal();
  };

  const filteredIngredients = ingredients
    .filter((ing) => {
      if (activeTab === "pending") return !ing.is_approved;
      if (activeTab === "approved") return ing.is_approved;
      return true;
    })
    .filter((ing) => ing.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredIngredients.length / PAGE_SIZE);
  const paginatedIngredients = filteredIngredients.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const pendingCount = ingredients.filter((ing) => !ing.is_approved).length;
  const approvedCount = ingredients.filter((ing) => ing.is_approved).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Administrador de Ingredientes
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
          Añadir Ingrediente(s)
        </button>
      </div>

      <div className="mb-4">
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">
          {pendingCount} ingrediente{pendingCount !== 1 ? "s" : ""} pendiente de
          aprobación
        </span>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => {
              setActiveTab("all");
              setPage(1);
            }}
          >
            Todos los Ingredientes ({ingredients.length})
          </button>
          <button
            className={`${
              activeTab === "pending"
                ? "border-yellow-500 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => {
              setActiveTab("pending");
              setPage(1);
            }}
          >
            Pendiente de probación
          </button>
          <button
            className={`${
              activeTab === "approved"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => {
              setActiveTab("approved");
              setPage(1);
            }}
          >
            Aprobado ({approvedCount})
          </button>
        </nav>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscando Ingredientes..."
          className="border px-3 py-2 rounded w-full max-w-xs"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Nombre de Ingrediente
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Categoria
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Unidad
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Añadido por...
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Estado
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : paginatedIngredients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No se han encontrado ingredientes.
                </td>
              </tr>
            ) : (
              paginatedIngredients.map((ing) => (
                <tr key={ing.id}>
                  <td className="py-2 px-4 border-b">{ing.name}</td>
                  <td className="py-2 px-4 border-b">
                    {ing.categories?.map((c) => c.name).join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ing.unit_type?.name || "-"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ing.user_id
                      ? ing.user_id.username || ing.user_id.email || "-"
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ing.is_approved ? (
                      <span className="text-green-600 font-medium">
                        Approved
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    {!ing.is_approved && (
                      <>
                        <button
                          onClick={() => handleApprove(ing.id)}
                          className="text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(ing.id)}
                          className="text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openEditModal(ing)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ing.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
            <h3 className="text-xl font-bold mb-4">Edit Ingredient</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  name="categories"
                  value={editForm.categories}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Categories"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Unit Type
                </label>
                <input
                  type="text"
                  name="unit_type"
                  value={editForm.unit_type}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Unit Type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Approved
                </label>
                <select
                  name="is_approved"
                  value={editForm.is_approved ? "true" : "false"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      is_approved: e.target.value === "true",
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientManagement;
