/**
 * Hook personalizado para obtener todas las categorías de recetas desde la API.
 *
 * Este hook utiliza el servicio `categoryService` para realizar una petición
 * GET al endpoint `/api/recipes/categories/` y devuelve la lista de categorías
 * junto con los estados de carga y error.
 *
 * @function useCategories
 * @returns {Object} Objeto con los siguientes campos:
 * - `categories` {Array<object>}: Lista de categorías obtenidas de la API.
 * - `loading` {boolean}: Estado de carga mientras se realiza la petición.
 * - `error` {Error|null}: Error en caso de fallo en la petición.
 *
 * @example
 * const { categories, loading, error } = useCategories();
 *
 * @author Ana Castro
 */


import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const TakeCategories = async () => {
      try {
        const data = await categoryService.getAllParentCategories(); 
        setCategories(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    TakeCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
