import api from "./api";
/**
 * src/services/ingredientService.js
 *
 * Provides service methods for interacting with ingredient API endpoints.
 * This includes fetching approved ingredients for general users,
 * and comprehensive CRUD operations for all ingredients for administrators.
 *
 * @module ingredientService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for general ingredient API endpoints.
 * Corresponds to `/api/ingredients/` in the backend.
 * This endpoint typically returns only approved ingredients.
 * 
 * @type {string}
 */
const BASE_URL = "/recipes/ingredients";

/**
 * Base URL for administrator-specific ingredient API endpoints.
 * Corresponds to `/api/admin/ingredients/` in the backend.
 * This endpoint typically returns all ingredients (approved and unapproved).
 * 
 * @type {string}
 */
const ADMIN_BASE_URL = "/recipes/admin/ingredients";

/**
 * Service for interacting with ingredient API endpoints.
 */
export const ingredientService = {
    // --- General User/Public methods (ReadOnlyModelViewSet) ---
    // These methods are accessible to all users (authenticated or not) and only allow GET operations.

    /**
    * Fetches a list of all APPROVED ingredients.
    * GET /api/recipes/ingredients/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of approved ingredient objects.
    * @throws {Error} If the API request fails.
    */
    getAllIngredients: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    /**
    * Fetches the details of a specific APPROVED ingredient by its ID.
    * GET /api/recipes/ingredients/<int:pk>/
    * 
    * @param {number} ingredientId - The ID of the ingredient to fetch.
    * @returns {Promise<object>} A promise that resolves with the ingredient's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found if the ingredient is not found or not approved).
    */
    getIngredientById: async (ingredientId) => {
        const response = await api.get(`${BASE_URL}/${ingredientId}/`);
        return response.data;
    },

    // --- Admin-specific methods ---

    /**
    * Fetches the details of a specific ingredient by its ID (for administrators).
    * This can fetch any ingredient, regardless of its approval status.
    * GET /api/recipes/admin/ingredients/<int:pk>/
    * 
    * @param {number} ingredientId - The ID of the ingredient to fetch.
    * @returns {Promise<object>} A promise that resolves with the ingredient's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    getIngredientByIdAdmin: async (ingredientId) => {
        const response = await api.get(`${ADMIN_BASE_URL}/${ingredientId}/`);
        return response.data;
    },

    /**
    * Fetches a list of ALL ingredients (approved and unapproved) for administrators.
    * GET /api/recipes/admin/ingredients/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of all ingredient objects.
    * @throws {Error} If the API request fails (e.g., 403 Forbidden for non-admins).
    */
    getAllIngredientsAdmin: async () => {
        const response = await api.get(`${ADMIN_BASE_URL}/`);
        return response.data;
    },

    /**
    * Creates a new ingredient (for administrators).
    * POST /api/recipes/admin/ingredients/
    * 
    * @param {object} ingredientData - An object containing the data for the new ingredient.
    * Expected fields: `name` (str), `description` (str), `quantity` (int), `unit` (str), `is_checked` (bool), `is_approved` (bool, if applicable).
    * @returns {Promise<object>} A promise that resolves with the newly created ingredient object.
    * @throws {Error} If the API request fails (e.g., validation errors, 403 Forbidden).
    */
    createIngredientAdmin: async (ingredientData) => {
        const response = await api.post(`${ADMIN_BASE_URL}/`, ingredientData);
        return response.data;
    },

    /**
    * Updates an existing ingredient by its ID (for administrators).
    * Uses PATCH for partial updates.
    * PATCH /api/recipes/admin/ingredients/<int:pk>/
    * 
    * @param {number} ingredientId - The ID of the ingredient to update.
    * @param {object} ingredientData - An object containing the ingredient data to update.
    * Expected fields: `name` (str), `description` (str), `quantity` (int), `unit` (str), `is_checked` (bool), `is_approved` (bool, if applicable).
    * @returns {Promise<object>} A promise that resolves with the updated ingredient object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateIngredientAdmin: async (ingredientId, ingredientData) => {
        const response = await api.put(`${ADMIN_BASE_URL}/${ingredientId}/`, ingredientData);
        return response.data;
    },

    /**
    * Deletes an ingredient by its ID (for administrators).
    * DELETE /api/recipes/admin/ingredients/<int:pk>/
    * 
    * @param {number} ingredientId - The ID of the ingredient to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the ingredient is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteIngredientAdmin: async (ingredientId) => {
        await api.delete(`${ADMIN_BASE_URL}/${ingredientId}/`);
        return true;
    }

};