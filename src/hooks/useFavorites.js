import { useState, useEffect } from "react";
import { favoriteService } from "../services/favoriteService";
import { getToken } from "../services/authService";
import { recipeService } from "../services/recipeService"; // Asegúrate de importar recipeService

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]); // Nuevo estado para datos completos
    const [loading, setLoading] = useState(true);

    const getUserFavorites = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const data = await favoriteService.getUserFavorites();
            setFavorites(data);
            
            // Obtener los datos completos de las recetas favoritas
            const recipesPromises = data.map(fav => 
                recipeService.getRecipeById(fav.recipe_id)
            );
            const recipesData = await Promise.all(recipesPromises);
            setFavoriteRecipes(recipesData.filter(recipe => recipe !== null));
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
                setFavorites(prev => prev.filter(fav => fav.id !== favorite.id));
                setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
            } else {
                await favoriteService.addFavorite(recipeId);
                // Obtenemos los datos de la nueva receta favorita
                const newRecipe = await recipeService.getRecipeById(recipeId);
                if (newRecipe) {
                    setFavoriteRecipes(prev => [...prev, newRecipe]);
                }
                getUserFavorites(); // Actualizamos la lista de IDs
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    useEffect(() => {
        getUserFavorites();
    }, []);

    return { 
        favorites: favorites.map(fav => String(fav.recipe_id)), // Solo IDs como strings
        favoriteRecipes, // Datos completos de las recetas
        loading, 
        toggleFavorite 
    };
};

export default useFavorites;