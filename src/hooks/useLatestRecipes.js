/**
 * Hook personalizado para obtener las 3 recetas más recientes desde la API,
 * ordenarlas por fecha de creación y devolverlas.
 *
 * @module useLatestRecipes * 
 *
 * @returns {Object} Objeto que contiene:
 * - `latestRecipes` {Array}: Lista ordenada con las recetas más recientes (máximo 3).
 * - `loading` {boolean}: Indicador de si los datos aún se están cargando.
 * 
 * @author Ana Castro basado en el código de Yuliia Martynovych en Home.jsx
 */


import { useEffect, useState } from "react";
import api from "../services/api";

const useLatestRecipes = () => {
    const [latestRecipes, setLatestRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await api.get("/recipes/recipes/");
                const recipes = Array.isArray(data.results) ? data.results : data;

                if (recipes.length) {
                    const sortedRecipes = recipes
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 3);
                    setLatestRecipes(sortedRecipes);
                } else {
                    console.warn("⚠️ No recipes available");
                }
            } catch (error) {
                console.error("🚨 Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    return { latestRecipes, loading };
};

export default useLatestRecipes;
