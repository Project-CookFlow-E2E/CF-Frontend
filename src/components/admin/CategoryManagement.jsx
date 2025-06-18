/**
 * @file CategoryManagement.jsx
 * @description
 * Componente de administración de categorías para el panel de administración.
 * Permite visualizar, buscar, añadir, editar y borrar categorías de recetas.
 *
 * Funcionalidades principales:
 * - Listar todas las categorías existentes.
 * - Buscar categorías por nombre mediante un input de búsqueda.
 * - Añadir nuevas categorías mediante un modal conectado al backend.
 * - Editar el nombre y la categoría padre de una categoría mediante un modal.
 * - Borrar categorías con confirmación mediante modal (pregunta antes de borrar y elimina en la BBDD).
 * - Acciones de edición y borrado para cada categoría, con overlays semitransparentes que dejan visible el panel de fondo.
 * - Paginación: muestra 5 categorías por página, con navegación entre páginas.
 * - Ordena las categorías de la más reciente a la más antigua según la fecha de creación.
 *
 * Estados:
 * - categories: array de categorías obtenidas del backend.
 * - loading: booleano para mostrar el estado de carga.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición.
 * - addModal: controla la visibilidad del modal de añadir categoría.
 * - addForm: almacena los valores del formulario de añadir categoría.
 * - deleteModal: controla la visibilidad y datos del modal de confirmación de borrado.
 * - page: página actual de la paginación.
 * - search: término de búsqueda para filtrar categorías por nombre.
 *
 * Servicios utilizados:
 * - categoryService.getAllCategories(): obtiene todas las categorías.
 * - categoryService.createCategoryAdmin(data): crea una nueva categoría.
 * - categoryService.updateCategoryAdmin(id, data): actualiza una categoría.
 * - categoryService.deleteCategoryAdmin(id): elimina una categoría.
 *
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite buscar, añadir, modificar y borrar categorías de forma sencilla y segura,
 * con confirmación visual y overlays que no ocultan completamente el panel de administración.
 *
 * Cambios recientes:
 * - Añadida funcionalidad para añadir categorías desde el panel (modal y conexión a backend).
 * - Añadida funcionalidad de borrado con confirmación y modal (incluye overlay semitransparente).
 * - Mejorada la experiencia visual de los modales para dejar visible el panel de fondo.
 *
 * @author Lorena Martínez, Noemi Casaprima
 * @modifiedBy Noemi Casaprima  (añadido: alta y borrado de categorías, overlays y experiencia de usuario en modales)
 */

import { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";

const PAGE_SIZE = 5;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState({ open: false, category: null });
  const [editForm, setEditForm] = useState({
    name: "",
    parent_category_id: "",
  });

  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", parent_category_id: "" });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();

        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setCategories(sorted);
      } catch (error) {
        {
          error;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openEditModal = (category) => {
    setEditForm({
      name: category.name || "",
      parent_category_id: category.parent_category_id || "",
    });
    setEditModal({ open: true, category });
  };

  const closeEditModal = () => setEditModal({ open: false, category: null });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editModal.category.id;
    const updatedData = {
      name: editForm.name,
      parent_category_id: editForm.parent_category_id || null,
    };
    await categoryService.updateCategoryAdmin(id, updatedData);
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
    );
    closeEditModal();
  };

  const openDeleteModal = (category) => setDeleteModal({ open: true, category });
  const closeDeleteModal = () => setDeleteModal({ open: false, category: null });
  const handleDeleteConfirm = async () => {
    const id = deleteModal.category.id;
    await categoryService.deleteCategoryAdmin(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    closeDeleteModal();
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Administrador de categorías
        </h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center" onClick={() => setAddModal(true)}>
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
          Añadir categoría
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar categorías..."
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
                Creador
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Categoría padre
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Fecha de creación
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No se encontraron categorias.
                </td>
              </tr>
            ) : (
              paginatedCategories.map((category) => (
                <tr key={category.id}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {category.name}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {category.user_id}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {category.parent_category_id}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {category.created_at}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                      onClick={() => openEditModal(category)}
                    >
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => openDeleteModal(category)}>
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={closeEditModal} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">Editar Categoría</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Nombre de la categoría"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría Padre (ID)
                </label>
                <input
                  type="text"
                  name="parent_category_id"
                  value={editForm.parent_category_id}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="ID de la categoría padre"
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

      {/* Modal de AÑADIR categoría */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={() => setAddModal(false)} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">Añadir Categoría</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const newCategory = await categoryService.createCategoryAdmin(addForm);
                setCategories((prev) => [newCategory, ...prev]);
                setAddModal(false);
                setAddForm({ name: "", parent_category_id: "" });
              } catch (err) {
                let msg = "Error al crear categoría";
                if (err && err.response && err.response.data) {
                  if (typeof err.response.data === 'string') msg += ": " + err.response.data;
                  else if (typeof err.response.data.detail === 'string') msg += ": " + err.response.data.detail;
                  else msg += ": " + JSON.stringify(err.response.data);
                }
                alert(msg);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" name="name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría Padre (ID)</label>
                <input type="text" name="parent_category_id" value={addForm.parent_category_id} onChange={e => setAddForm(f => ({ ...f, parent_category_id: e.target.value }))} className="w-full border p-2 rounded" placeholder="ID de la categoría padre (opcional)" />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setAddModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de CONFIRMACIÓN de borrado */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={closeDeleteModal} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">¿Seguro que quieres borrar esta categoría?</h3>
            <div className="mb-4">Esta acción no se puede deshacer.</div>
            <div className="flex justify-end space-x-2">
              <button onClick={closeDeleteModal} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Borrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
