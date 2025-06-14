/**
 * Custom hook to manage the authenticated user's favorites.
 * This hook handles the fetching, adding, and removing of favorite recipes.
 * It also manages the state of the favorites list and provides the `toggleFavorite`
 * function to add or remove a recipe from the favorites.
 *
 * @module useFavorites
 * @author Ana Castro
 *
 * @returns {Object} The object containing the following properties:
 * - `favorites` {Array}: The list of favorite recipes for the authenticated user.
 * - `loading` {boolean}: A flag indicating if the favorites data is being fetched.
 * - `toggleFavorite` {function}: A function that toggles a recipe between being a favorite and not a favorite.
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
