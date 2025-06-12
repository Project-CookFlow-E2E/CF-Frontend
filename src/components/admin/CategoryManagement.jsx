/**
 * @file CategoryManagement.jsx
 * @description
 * Componente de administración de categorías para el panel de administración.
 * Permite visualizar, editar y gestionar categorías de recetas.
 * 
 * Funcionalidades principales:
 * - Listar todas las categorías existentes.
 * - Editar el nombre y la categoría padre de una categoría mediante un modal.
 * - Botón para añadir nuevas categorías (funcionalidad pendiente de implementar).
 * - Acciones de edición y borrado para cada categoría.
 * 
 * Estados:
 * - categories: array de categorías obtenidas del backend.
 * - loading: booleano para mostrar el estado de carga.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición.
 * 
 * Servicios utilizados:
 * - categoryService.getAllCategories(): obtiene todas las categorías.
 * - categoryService.updateCategoryAdmin(id, data): actualiza una categoría.
 * 
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite modificar los campos "Nombre" y "Categoría Padre" de cada categoría.
 * 
 * @author
 * Lorena Martínez
 */

import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  const [editModal, setEditModal] = useState({ open: false, category: null });
  const [editForm, setEditForm] = useState({ name: '', parent_category_id: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        {error}
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);


  const openEditModal = (category) => {
    setEditForm({
      name: category.name || '',
      parent_category_id: category.parent_category_id || '',
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Administrador de categorías</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Añadir categoría
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Creador</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Categoría padre</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Fecha de creación</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Cargando...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">No se encontraron categorias.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{category.name}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{category.user_id}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{category.parent_category_id}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{category.created_at}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                      onClick={() => openEditModal(category)}
                    >
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900">Borrar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>
          <button className="px-3 py-1 border rounded-md mr-1">Anterior</button>
          <button className="px-3 py-1 border rounded-md">Siguiente</button>
        </div>
      </div>
      {/* Modal de edición */}
      {editModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                <label className="block text-sm font-medium mb-1">Categoría Padre (ID)</label>
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
    </div>
  );
};

export default CategoryManagement;