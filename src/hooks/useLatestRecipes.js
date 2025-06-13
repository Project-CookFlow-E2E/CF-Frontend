/**
 * Hook personalizado para obtener las recetas más recientes desde la API.
 *
 * Este hook se conecta al servicio `recipeService` y realiza una consulta GET
 * con orden descendente por fecha de creación (`ordering=-created_at`). Permite
 * opcionalmente limitar la cantidad de recetas devueltas.
 *
 * @function useLatestRecipes
 * @param {number} [limit=3] - Número de recetas a obtener (por defecto 3).
 * @returns {Object} Objeto con los siguientes campos:
 * - `recipes` {Array<object>}: Lista de recetas ordenadas por fecha.
 * - `loading` {boolean}: Estado de carga mientras se realiza la petición.
 * - `error` {Error|null}: Error en caso de fallo en la petición.
 *
 * @example
 * const { recipes, loading, error } = useLatestRecipes(5);
 *
 * @author Ana Castro
 */

import { useEffect, useState } from "react";
import { recipeService } from "../services/recipeService";

const useLatestRecipes = (limit = 3) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const TakeLatest = async () => {
            try {
                const data = await recipeService.getAllRecipes({
                    ordering: "-created_at",
                    limit: limit,
                });
                setRecipes(data.results || data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        TakeLatest();
    }, [limit]);

    return { recipes, loading, error };
};

export default useLatestRecipes;
