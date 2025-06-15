/**
 * Hook personalizado para gestionar los favoritos del usuario autenticado.
 * Este hook se encarga de obtener, añadir y eliminar recetas favoritas.
 * También gestiona el estado de la lista de favoritos y expone la función `toggleFavorite`
 * para alternar entre marcar o desmarcar una receta como favorita.
 *
 * @module useFavorites
 * @author Ana Castro basado en el código de Yuliia Martynovych en Home.jsx
 *
 * @returns {Object} Objeto que contiene las siguientes propiedades:
 * - `favorites` {Array}: Lista de recetas favoritas del usuario autenticado.
 * - `loading` {boolean}: Indicador de si se están cargando los datos de favoritos.
 * - `toggleFavorite` {function}: Función que añade o elimina una receta de la lista de favoritos.
 */


import { useState, useEffect } from "react";
import { favoriteService } from "../services/favoriteService";
import { getToken } from "../services/authService";

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserFavorites = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const data = await favoriteService.getUserFavorites();
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (recipeId) => {
        const token = getToken();
        if (!token) return;

        const favorite = favorites.find((fav) => fav.recipe_id === recipeId);

        try {
            if (favorite) {
                await favoriteService.removeFavorite(favorite.id);
                setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favorite.id));
            } else {
                await favoriteService.addFavorite(recipeId);
                getUserFavorites(); // Refresh favorites list after adding a favorite
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    useEffect(() => {
        getUserFavorites();
    }, []);

    return { favorites, loading, toggleFavorite };
};

export default useFavorites;
