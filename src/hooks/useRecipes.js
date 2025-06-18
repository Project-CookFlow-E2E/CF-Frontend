/**
 * @file useRecipes.js
 * @description Hook personalizado para obtener todas las recetas desde el backend.
 * Encapsula la lógica de llamada a la API, gestión de estado y manejo de errores.
 *
 * @author Saray
 * @modified Ana Castro - Implementación con control de desmontaje del componente y carga inicial.
 */

import { useState, useEffect } from "react";
import { recipeService } from "../services/recipeService";

export default function useRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchRecipes() {
            setLoading(true);
            try {
                const data = await recipeService.getAllRecipes();
                if (isMounted) setRecipes(data);
            } catch (err) {
                console.error("Error fetching recipes:", err);
                if (isMounted) setRecipes([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchRecipes();
        return () => {
            isMounted = false;
        };
    }, []);

    return { recipes, loading };
}
