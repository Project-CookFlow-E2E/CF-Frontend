import api from "./api";
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
        if (typeof amountRecipes !== 'number' || !Number.isInteger(amountRecipes) || amountRecipes <= 0) {
            throw new Error("Invalid parameter: received parameter must be a positive integer number");
        }
        const params = {
            ordering: "-created_at",
            limit: amountRecipes,
        };
        const response = await api.get(`${BASE_URL}/`, { params });
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
    * @param {object} recipeData - An object containing the data for the new recipe.
    * Must include `name` (str), `description` (str), `duration_minutes` (int), `commensals` (int),
    * and `categories` (array of int IDs).
    * @returns {Promise<object>} A promise that resolves with the newly created recipe object.
    * @throws {Error} If the API request fails (e.g., validation errors, 401 Unauthorized).
    */
    createRecipe: async (recipeData) => {
        const response = await api.post(`${BASE_URL}/`, recipeData);
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
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateRecipe: async (recipeId, recipeData) => {
        const response = await api.patch(`${BASE_URL}/${recipeId}/`, recipeData);
        return response.data; 
    },

    /**
    * Deletes a recipe by its ID. Requires user authentication and ownership/admin privileges.
    * DELETE /api/recipes/recipes/<int:pk>/
    * 
    * @param {number} recipeId - The ID of the recipe to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the recipe is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteRecipe: async (recipeId) => {
        await api.delete(`${BASE_URL}/${recipeId}/`);
        return true;
    }

};