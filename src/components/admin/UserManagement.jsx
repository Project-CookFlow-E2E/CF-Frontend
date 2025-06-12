/**
 * @file UserManagement.jsx
 * @description
 * Componente de administración de usuarios para el panel de administración.
 * Permite visualizar, buscar, editar y gestionar usuarios.
 *
 * Funcionalidades principales:
 * - Listar todos los usuarios existentes.
 * - Buscar usuarios por nombre mediante un input de búsqueda.
 * - Editar el nombre y el rol de un usuario mediante un modal.
 * - Botón para añadir nuevos usuarios (funcionalidad pendiente de implementar).
 * - Acciones de edición y borrado para cada usuario.
 * - Paginación: muestra 5 usuarios por página, con navegación entre páginas.
 *
 * Estados:
 * - users: array de usuarios obtenidos del backend.
 * - loading: booleano para mostrar el estado de carga.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición.
 * - page: página actual de la paginación.
 * - search: término de búsqueda para filtrar usuarios por nombre.
 *
 * Servicios utilizados:
 * - userService.getAllUsersAdmin(): obtiene todos los usuarios.
 * - userService.updateUserAdmin(id, data): actualiza un usuario.
 *
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite buscar y modificar los campos "Nombre" y "Rol" de cada usuario,
 * navegar entre páginas y gestionar la información de usuarios de forma sencilla.
 *
 * @author
 * Lorena Martínez
 */

import { useState, useEffect } from "react";
import { userService } from "../../services/userService";

const PAGE_SIZE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({ name: "", is_staff: false });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsersAdmin();
        setUsers(data);
      } catch (error) {
        {
          error;
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setEditForm({
      name: user.name || "",
      is_staff: !!user.is_staff,
    });
    setEditModal({ open: true, user });
  };

  const closeEditModal = () => setEditModal({ open: false, user: null });

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editModal.user.id;
    const updatedData = {
      name: editForm.name,
      is_staff: editForm.is_staff,
    };
    await userService.updateUserAdmin(id, updatedData);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    );
    closeEditModal();
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Administrador de usuarios
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
          Añadir usuario
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar usuarios..."
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
                Nombre de usuario
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Rol
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
                <td colSpan={7} className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.name}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.username}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {user.is_staff ? (
                      <span className="bg-pink-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Usuario
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.created_at}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {user.updated_at}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      Ver
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                      onClick={() => openEditModal(user)}
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
            <h3 className="text-xl font-bold mb-4">Editar Usuario</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  name="is_staff"
                  value={editForm.is_staff ? "admin" : "user"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      is_staff: e.target.value === "admin",
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
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

export default UserManagement;
