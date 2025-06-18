/**
 * @file UserManagement.jsx
 * @description
 * Componente de administración de usuarios para el panel de administración.
 * Permite visualizar, buscar, editar y gestionar usuarios.
 *
 * Funcionalidades principales:
 * - Listar todos los usuarios existentes (conectados al backend con userService.getAllUsersAdmin).
 * - Buscar usuarios por nombre de usuario (username) mediante un input de búsqueda (consulta siempre al backend con debounce y filtra por username, no por name).
 * - Editar el nombre, el rol y la contraseña de un usuario mediante un modal (la contraseña solo se actualiza si se rellena el campo).
 * - Muestra un mensaje de éxito o error tras editar un usuario (incluido el cambio de contraseña).
 * - Botón para añadir nuevos usuarios (funcionalidad pendiente de implementar).
 * - Acciones de edición y borrado para cada usuario (no disponibles para usuarios admin/staff).
 * - Paginación: muestra 5 usuarios por página, con navegación entre páginas.
 *
 * Estados:
 * - users: array de usuarios obtenidos del backend (ya filtrados por username si hay búsqueda).
 * - loading: booleano para mostrar el estado de carga.
 * - editModal: controla la visibilidad y datos del modal de edición.
 * - editForm: almacena los valores del formulario de edición (incluye password).
 * - editMsg: mensaje de éxito tras editar usuario.
 * - editError: mensaje de error tras editar usuario.
 * - page: página actual de la paginación.
 * - search: término de búsqueda para filtrar usuarios por nombre de usuario.
 *
 * Servicios utilizados:
 * - userService.getAllUsersAdmin(): obtiene todos los usuarios.
 * - userService.searchUsersByUsernameAdmin(username): busca usuarios por nombre de usuario en el backend.
 * - userService.updateUserAdmin(id, data): actualiza un usuario (incluida la contraseña si se indica).
 *
 * Uso:
 * Este componente está pensado para ser usado por administradores.
 * Permite buscar y modificar los campos "Nombre", "Rol" y "Contraseña" de cada usuario,
 * navegar entre páginas y gestionar la información de usuarios de forma sencilla.
 *
 * Cambios recientes:
 * - La búsqueda de usuarios consulta siempre al backend (con debounce) y filtra solo por username.
 * - Se eliminó el filtrado local por name.
 * - Se añadió un filtrado extra por username en frontend para asegurar coincidencia si el backend no filtra correctamente.
 * - Ahora el administrador puede cambiar la contraseña de los usuarios desde el modal de edición.
 * - Se muestra un mensaje de éxito o error tras editar un usuario.
 *
 * @author
 * Lorena Martínez, Noemi Casaprima
 */

import { useState, useEffect, useRef } from "react";
import { userService } from "../../services/userService";

const PAGE_SIZE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({ name: "", is_staff: false, password: "" });
  const [editMsg, setEditMsg] = useState("");
  const [editError, setEditError] = useState("");

  const [viewModal, setViewModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", surname: "", second_surname: "", username: "", email: "", password: "", is_staff: false });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef();

  useEffect(() => {
    if (!search.trim()) {
      setLoading(true);
      userService
        .getAllUsersAdmin()
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Filtra SOLO por username exacto o parcial (case-insensitive) en el backend
        const data = await userService.searchUsersByUsernameAdmin(search);
        // Si el backend no filtra correctamente, filtra aquí SOLO por username
        const filtered = data.filter((user) =>
          user.username && user.username.toLowerCase().includes(search.toLowerCase())
        );
        setUsers(filtered);
        setPage(1);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const openEditModal = (user) => {
    setEditForm({
      name: user.name || "",
      is_staff: !!user.is_staff,
      password: ""
    });
    setEditModal({ open: true, user });
  };

  const closeEditModal = () => setEditModal({ open: false, user: null });

  const openViewModal = (user) => {
    setViewModal({ open: true, user });
  };

  const closeViewModal = () => setViewModal({ open: false, user: null });

  const openDeleteModal = (user) => {
    setDeleteModal({ open: true, user });
  };

  const closeDeleteModal = () => setDeleteModal({ open: false, user: null });

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditMsg("");
    setEditError("");
    const id = editModal.user.id;
    const updatedData = {
      name: editForm.name,
      is_staff: editForm.is_staff,
    };
    if (editForm.password) {
      updatedData.password = editForm.password;
    }
    try {
      await userService.updateUserAdmin(id, updatedData);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
      );
      setEditMsg("Usuario actualizado correctamente.");
      setTimeout(() => {
        setEditMsg("");
        closeEditModal();
      }, 1500);
    } catch (err) {
      let msg = "Error al actualizar usuario";
      if (err && err.response && err.response.data) {
        if (typeof err.response.data === "string") msg += ": " + err.response.data;
        else if (typeof err.response.data.detail === "string") msg += ": " + err.response.data.detail;
        else msg += ": " + JSON.stringify(err.response.data);
      }
      setEditError(msg);
      setTimeout(() => setEditError(""), 3500);
    }
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.user.id;
    await userService.deleteUserAdmin(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    closeDeleteModal();
  };

  // Elimina el filtrado local por name, solo usa los resultados del backend (ya filtrados por username)
  // const filteredUsers = users.filter((user) =>
  //   user.name.toLowerCase().includes(search.toLowerCase())
  // );
  // const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  // const paginatedUsers = filteredUsers.slice(
  //   (page - 1) * PAGE_SIZE,
  //   page * PAGE_SIZE
  // );
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(
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
          Añadir usuario
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar usuarios por nombre de usuario..."
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
                <td colSpan="8" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
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
                    {/* Solo mostrar acciones si NO es admin ni staff */}
                    {!(user.is_staff || user.is_admin) && (
                      <>
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => openViewModal(user)}
                        >
                          Ver
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900 mr-2"
                          onClick={() => openEditModal(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteModal(user)}
                        >
                          Borrar
                        </button>
                      </>
                    )}
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
          <div className="fixed inset-0 z-0" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} onClick={closeEditModal} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">Editar Usuario</h3>
            {editMsg && <div className="text-green-600 text-sm mb-2">{editMsg}</div>}
            {editError && <div className="text-red-600 text-sm mb-2">{editError}</div>}
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
              <div>
                <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="w-full border p-2 rounded"
                  placeholder="Dejar en blanco para no cambiar"
                  autoComplete="new-password"
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

      {/* Modal de VER usuario */}
      {viewModal?.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-0" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} onClick={closeViewModal} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">Detalles del Usuario</h3>
            <div className="space-y-2">
              <div><span className="font-semibold">Nombre:</span> {viewModal.user?.name}</div>
              <div><span className="font-semibold">Nombre de usuario:</span> {viewModal.user?.username}</div>
              <div><span className="font-semibold">Email:</span> {viewModal.user?.email}</div>
              <div><span className="font-semibold">Rol:</span> {viewModal.user?.is_staff ? 'Admin' : 'Usuario'}</div>
              <div><span className="font-semibold">Creado:</span> {viewModal.user?.created_at}</div>
              <div><span className="font-semibold">Actualizado:</span> {viewModal.user?.updated_at}</div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={closeViewModal} className="bg-gray-300 px-4 py-2 rounded">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de CONFIRMACIÓN de borrado */}
      {deleteModal?.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-0" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} onClick={closeDeleteModal} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">¿Seguro que quieres borrar este usuario?</h3>
            <div className="mb-4">Esta acción no se puede deshacer.</div>
            <div className="flex justify-end space-x-2">
              <button onClick={closeDeleteModal} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
              <button onClick={handleDeleteConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Borrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de AÑADIR usuario */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={() => setAddModal(false)} />
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
            <h3 className="text-xl font-bold mb-4">Añadir Usuario</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const newUser = await userService.createUserAdmin(addForm);
                setUsers((prev) => [newUser, ...prev]);
                setAddModal(false);
                setAddForm({ name: "", surname: "", second_surname: "", username: "", email: "", password: "", is_staff: false });
              } catch (err) {
                let msg = "Error al crear usuario";
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
                <label className="block text-sm font-medium mb-1">Primer apellido</label>
                <input type="text" name="surname" value={addForm.surname} onChange={e => setAddForm(f => ({ ...f, surname: e.target.value }))} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Segundo apellido</label>
                <input type="text" name="second_surname" value={addForm.second_surname} onChange={e => setAddForm(f => ({ ...f, second_surname: e.target.value }))} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
                <input type="text" name="username" value={addForm.username} onChange={e => setAddForm(f => ({ ...f, username: e.target.value }))} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input type="password" name="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select name="is_staff" value={addForm.is_staff ? "admin" : "user"} onChange={e => setAddForm(f => ({ ...f, is_staff: e.target.value === "admin" }))} className="w-full border p-2 rounded">
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setAddModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
