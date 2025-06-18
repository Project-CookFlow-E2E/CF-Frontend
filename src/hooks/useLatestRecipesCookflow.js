import { useEffect, useState } from "react";
import { recipeService } from "../services/recipeService";

/**
 * Hook personalizado para obtener las 3 recetas más recientes desde la API y creadas por el usuario cookflow,
 * ordenadas por fecha de creación.
 *
 * @module useLatestRecipes
 * @returns {Object} Objeto que contiene:
 * - `latestRecipes` {Array}: Lista ordenada con las recetas más recientes (máximo 3).
 * - `loading` {boolean}: Indicador de si los datos aún se están cargando.
 * @author Ángel Aragón
 */

const useLatestRecipesCookflow = () => {
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const latest = await recipeService.getMostRecentRecipesAdmin(3);
        setLatestRecipes(latest.results || latest);
      } catch (error) {
        console.error("Error fetching latest recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { latestRecipes, loading };
};

export default useLatestRecipesCookflow;
