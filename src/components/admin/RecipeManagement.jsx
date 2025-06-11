import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";


const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await recipeService.getRecipes();
        setRecipes(data);
      } catch (error) {
        {error}
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Administrador de recetas</h2>
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Receta
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
            ) : recipes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No se encontraron recetas.
                </td>
              </tr>
            ) : (
              recipes.map((recipe) => (
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
                    <button className="text-yellow-600 hover:text-yellow-900 mr-2">
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
        <div>
          <button className="px-3 py-1 border rounded-md mr-1">Anterior</button>
          <button className="px-3 py-1 border rounded-md">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeManagement;
