import {useState, useEffect} from 'react';
import {getAllUsersAdmin} from '../../services/userService';

const UserManagement = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersAdmin();
        setUsers(data);
      } catch (error) {
        {error}
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }
  , []);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Administrador de usuarios</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Añadir usuario
        </button>
      </div>
   
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Nombre de usuario</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Rol</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Fecha de creación</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Fecha de actualización</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Cargando...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">No se encontraron usuarios.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{user.name}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{user.username}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{user.email}</td>
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
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{user.created_at}</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">{user.updated_at}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Ver</button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-2">Editar</button>
                    <button className="text-red-600 hover:text-red-900">Borrar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <button className="px-3 py-1 border rounded-md mr-1">Anterior</button>
        <button className="px-3 py-1 border rounded-md">Siguiente</button>
      </div>
    </div>
  );
}

export default UserManagement;