import api from "./api";
import { getUserIdFromToken } from "./authService";
/**
 * src/services/recipeService.js
 *
 * Provides service methods for interacting with recipe API endpoints.
 * This includes fetching, creating, updating, and deleting recipes.
 *
 * @module recipeService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for recipe API endpoints.
 * Corresponds to `/api/recipes/recipes/` in the backend.
 *
 * @type {string}
 */
const BASE_URL = "/recipes/recipes";

/**
 * Service for interacting with recipe API endpoints.
 */
export const recipeService = {

    /**
     * Fetches a list of all recipes.
     * GET /api/recipes/recipes/
     *
     * @returns {Promise<Array<object>>} A promise that resolves with an array of recipe objects.
     * @throws {Error} If the API request fails.
     */
    getAllRecipes: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    /**
     * Fetches the details of a specific recipe by its ID.
     * GET /api/recipes/recipes/<int:pk>/
     *
     * @param {number} recipeId - The ID of the recipe to fetch.
     * @returns {Promise<object>} A promise that resolves with the recipe's data.
     * @throws {Error} If the API request fails (e.g., 404 Not Found).
     */
    getRecipeById: async (recipeId) => {
        if (typeof recipeId !== 'number' || isNaN(recipeId) || recipeId < 1) {
            return Promise.reject(new Error("recipe id not valid."));
        };
        const response = await api.get(`${BASE_URL}/${recipeId}/`);
        return response.data;
    },

    /**
     * Fetches a specified number of the most recently created recipes.
     * This assumes your backend allows ordering by a creation timestamp
     * (e.g., `created_at` or `id` in descending order) and supports a `limit` parameter
     * for pagination.
     *
     * Example API request: `GET /api/recipes/recipes/?ordering=-created_at&limit=<amountRecipes>`
     *
     * @async
     * @param {number} amountRecipes - The number of most recent recipes to fetch.
     * @returns {Promise<Array<object>>} A promise that resolves with an array of the most recent Recipe objects.
     * @throws {Error} If the API request fails or if `amountRecipes` is not a valid positive number.
     */
    getMostRecentRecipes: async (amountRecipes) => {
        if (
            typeof amountRecipes !== "number" ||
            !Number.isInteger(amountRecipes) ||
            amountRecipes <= 0
        ) {
            throw new Error(
                "Invalid parameter: received parameter must be a positive integer number"
            );
        }
        const params = {
            ordering: "-created_at",
            limit: amountRecipes,
        };
        const response = await api.get(`${BASE_URL}/`, { params });
        return response.data;
    },

    /**
     * Fetches a specified number of the most recently created recipes by cookflow user (userId=1).
     * This assumes your backend allows ordering by a creation timestamp
     * (e.g., `created_at` or `id` in descending order) and supports a `limit` parameter
     * for pagination.
     *
     * Example API request: `GET /api/recipes/recipes/?ordering=-created_at&user_id=1&limit=<amountRecipes>`
     *
     * @async
     * @param {number} amountRecipes - The number of most recent recipes to fetch.
     * @returns {Promise<Array<object>>} A promise that resolves with an array of the most recent Recipe objects.
     * @throws {Error} If the API request fails or if `amountRecipes` is not a valid positive number.
     */
    getMostRecentRecipesAdmin: async (amountRecipes) => {
        if (
            typeof amountRecipes !== "number" ||
            !Number.isInteger(amountRecipes) ||
            amountRecipes <= 0
        ) {
            throw new Error(
                "Invalid parameter: received parameter must be a positive integer number"
            );
        }
        const params = {
            ordering: "-created_at",
            limit: amountRecipes,
            user_id: 1,
        };
        const response = await api.get(`${BASE_URL}/`, { params });
        return response.data;
    },

    /**
     * Fetches a list of recipes filtered by a specific user ID.
     * This utilizes the backend's filtering capabilities on the recipes list endpoint.
     * GET /api/recipes/?user_id={userId}
     *
     * @param {number} userId (optional) - The unique integer ID of the user whose recipes are to be fetched.
     * Must be a positive integer.
     * @returns {Promise<Array<object>>} A promise that resolves with an array of recipe objects
     * belonging to the specified user. Returns an empty array
     * if no recipes are found for the given user ID.
     * @throws {Error} If `userId` is not a valid positive integer, if the API request fails
     * (e.g., network error, server error) or token doesn't have and user id.
     */
    getRecipeByUserId: async (userId) => {
        let finalUserId = userId;

        if (finalUserId === null || typeof finalUserId === "undefined") {
            try {
                finalUserId = await getUserIdFromToken();
            } catch (error) {
                throw new Error(
                    "The user id is not delivered from token: " + error.message
                );
            }
        }

        if (
            typeof finalUserId !== "number" ||
            !Number.isInteger(finalUserId) ||
            finalUserId <= 0
        ) {
            throw new Error("User id is not valid.");
        }

        const response = await api.get(`${BASE_URL}/?user_id=${finalUserId}`);
        return response.data;
    },

    /**
     * Fetches a specified number of random recipes from the backend.
     * This function enforces a maximum limit of 5 recipes per request to optimize database petition.
     *
     * GET /api/recipes/recipes/random/?count={numRecipes}
     *
     * @async
     * @param {number} numRecipes - The desired number of random recipes to fetch.
     * Must be a positive integer between 1 and 5 (inclusive).
     * @returns {Promise<Array<object>>} A promise that resolves with an array of random recipe objects.
     * @throws {Error} If `numRecipes` is not a valid positive integer,
     * or if `numRecipes` exceeds the maximum allowed limit of 5,
     * or if the API request fails (e.g., network error, server error).
     */
    getRandomRecipes: async (numRecipes) => {
        if (
            typeof numRecipes !== "number" ||
            !Number.isInteger(numRecipes) ||
            numRecipes <= 0
        ) {
            throw new Error(
                "Invalid parameter: received parameter must be a positive integer number"
            );
        }
        if (numRecipes > 5) {
            throw new Error("Max 5 recipes for DB petition.");
        }
        const response = await api.get(`${BASE_URL}/random?count=${numRecipes}`);
        return response.data;
    },

    /**
     * Creates a new recipe.
     * This typically requires user authentication.
     * The `user` field for the recipe will be automatically assigned by the backend
     * based on the authenticated user making the request, so it should NOT be included in `recipeData`.
     * Also, the `steps` field is read-only on the backend, so it should NOT be included in `recipeData`.
     * POST /api/recipes/recipes/
     *
     * @param {FormData} recipeData - A FormData object containing the data for the new recipe,
     * including text fields and File objects for images.
     * @returns {Promise<object>} A promise that resolves with the newly created recipe object.
     * @throws {Error} If the API request fails (e.g., validation errors, 401 Unauthorized).
     */
    createRecipe: async (recipeData) => {
        // Si hay imagen o archivos, convertir a FormData
        let dataToSend = recipeData;
        if (
            recipeData.image ||
            (recipeData.steps && recipeData.steps.some(s => s.image))
        ) {
            const formData = new FormData();
            formData.append('name', recipeData.name);
            formData.append('description', recipeData.description);
            formData.append('duration_minutes', recipeData.duration_minutes);
            formData.append('commensals', recipeData.commensals);
            recipeData.categories.forEach((cat, i) => formData.append(`categories[${i}]`, cat));
            if (recipeData.image) formData.append('image', recipeData.image);
            // Ingredientes
            recipeData.ingredients.forEach((ing, i) => {
                formData.append(`ingredients[${i}][name]`, ing.name);
                formData.append(`ingredients[${i}][quantity]`, ing.quantity);
                formData.append(`ingredients[${i}][type]`, ing.type || '');
                formData.append(`ingredients[${i}][unit]`, ing.unit);
            });
            // Pasos
            recipeData.steps.forEach((step, i) => {
                formData.append(`steps[${i}][text]`, step.text);
                if (step.image) formData.append(`steps[${i}][image]`, step.image);
            });
            dataToSend = formData;
        }
        const response = await api.post(`${BASE_URL}/`, dataToSend, {
            headers: dataToSend instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
        });
        // The duplicate `const response` line that caused the error has been removed.
        return response.data;
    },

    /**
     * Updates an existing recipe by its ID.
     * Uses PATCH for partial updates. Requires user authentication and ownership/admin privileges.
     * The `steps` field is read-only on the backend, so it should NOT be included in `recipeData`.
     * PATCH /api/recipes/recipes/<int:pk>/
     *
     * @param {number} recipeId - The ID of the recipe to update.
     * @param {object} recipeData - An object containing the recipe data to update.
     * Can include `name` (str), `description` (str), `duration_minutes` (int), `commensals` (int),
     * and `categories` (array of int IDs).
     * @returns {Promise<object>} A promise that resolves with the updated recipe object.
     * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden) or recipe id is not valid.
     */
    updateRecipe: async (recipeId, recipeData) => {
        if (typeof recipeId !== 'number' || isNaN(recipeId) || recipeId < 1) {
            return Promise.reject(new Error("recipe id not valid."));
        };
        const response = await api.patch(`${BASE_URL}/${recipeId}/`, recipeData);
        return response.data;
    },

    /**
     * Deletes a recipe by its ID. Requires user authentication and ownership/admin privileges.
     * DELETE /api/recipes/recipes/<int:pk>/
     *
     * @param {number} recipeId - The ID of the recipe to delete.
     * @returns {Promise<boolean>} A promise that resolves with `true` if the recipe is successfully deleted.
     * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden) or recipe id is not valid.
     */
    deleteRecipe: async (recipeId) => {
        if (typeof recipeId !== 'number' || isNaN(recipeId) || recipeId < 1) {
            return Promise.reject(new Error("recipe id not valid."));
        };
        await api.delete(`${BASE_URL}/${recipeId}/`);
        return true;
    },
};