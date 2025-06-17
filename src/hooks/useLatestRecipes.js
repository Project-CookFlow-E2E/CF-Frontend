import { useEffect, useState } from "react";
import { recipeService } from "../services/recipeService";

/**
 * Hook personalizado para obtener las 3 recetas más recientes desde la API,
 * ordenadas por fecha de creación.
 *
 * @module useLatestRecipes
 * @returns {Object} Objeto que contiene:
 * - `latestRecipes` {Array}: Lista ordenada con las recetas más recientes (máximo 3).
 * - `loading` {boolean}: Indicador de si los datos aún se están cargando.
 * @author Ana Castro
 */

const useLatestRecipes = () => {
    const [latestRecipes, setLatestRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const latest = await recipeService.getMostRecentRecipes(3);
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

export default useLatestRecipes;
