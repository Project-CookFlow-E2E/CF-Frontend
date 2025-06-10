import api from "./api";
/**
 * src/services/stepService.js
 *
 * Provides service methods for interacting with recipe step API endpoints.
 * This includes fetching, creating, updating, and deleting steps for general use
 * and specific administrative operations.
 *
 * @module stepService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for general recipe step API endpoints.
 * Corresponds to `/api/steps/` in the backend.
 * @type {string}
 */
const BASE_URL = "/steps";

/**
 * Base URL for administrator-specific recipe step API endpoints.
 * Corresponds to `/api/admin/steps/` in the backend.
 * @type {string}
 */
const ADMIN_BASE_URL = "/admin/steps";

/**
 * Service for interacting with recipe step API endpoints.
 */
export const stepService = {

    /**
    * Fetches a list of all recipe steps. Can be filtered by recipe ID.
    * GET /api/steps/ or GET /api/steps/?recipe_id=<id>
    * 
    * @param {object} [params] - Optional query parameters.
    * @param {number} [params.recipeId] - Filters steps to a specific recipe.
    * @returns {Promise<Array<object>>} A promise that resolves with an array of step objects.
    * @throws {Error} If the API request fails.
    */
    getAllSteps: async (params = {}) => {
        const config = params.recipeId ? { params: { recipe_id: params.recipeId } } : {};
        const response = await api.get(`${BASE_URL}/`, config);
        return response.data;
    },

    /**
    * Fetches the details of a specific recipe step by its ID.
    * GET /api/steps/<int:pk>/
    * 
    * @param {number} stepId - The ID of the step to fetch.
    * @returns {Promise<object>} A promise that resolves with the step's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found).
    */
    getStepById: async (stepId) => {
        const response = await api.get(`${BASE_URL}/${stepId}`);
        return response.data;
    },

    /**
    * Creates a new recipe step. Requires user authentication.
    * POST /api/steps/
    * 
    * @param {object} stepData - An object containing the data for the new step.
    * Must include `order` (int), `description` (string), and `recipe` (int, the ID of the parent recipe).
    * @returns {Promise<object>} A promise that resolves with the newly created step object.
    * @throws {Error} If the API request fails (e.g., validation errors, 401 Unauthorized).
    */
    createStep: async (stepData) => {
        const response = await api.post(`${BASE_URL}/`, stepData);
        return response.data;
    },

    /**
    * Updates an existing recipe step by its ID. Requires user authentication.
    * Uses PATCH for partial updates.
    * PATCH /api/steps/<int:pk>/
    * 
    * @param {number} stepId - The ID of the step to update.
    * @param {object} stepData - An object containing the step data to update.
    * Can include `order` (int), `description` (string), and `recipe` (int, the ID of the parent recipe).
    * @returns {Promise<object>} A promise that resolves with the updated step object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateStep: async (stepId, stepData) => {
        const response = await api.put(`${BASE_URL}/${stepId}`, stepData);
        return response.data;
    },

    /**
    * Deletes a recipe step by its ID. Requires user authentication.
    * DELETE /api/steps/<int:pk>/
    * 
    * @param {number} stepId - The ID of the step to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the step is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteStep: async (stepId) => {
        await api.delete(`${BASE_URL}/${stepId}`);
        return true;
    },

    // --- Admin-specific methods ---

    /**
    * Fetches a list of all recipe steps (for administrators). Requires admin authentication.
    * GET /api/admin/steps/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of step objects.
    * @throws {Error} If the API request fails (e.g., 403 Forbidden).
    */
    getAllStepsAdmin: async () => {
        const response = await api.get(`${ADMIN_BASE_URL}/`);
        return response.data;
    },

    /**
    * Fetches the details of a specific recipe step by its ID (for administrators). Requires admin authentication.
    * GET /api/admin/steps/<int:pk>/
    * 
    * @param {number} stepId - The ID of the step to fetch.
    * @returns {Promise<object>} A promise that resolves with the step's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    getStepByIdAdmin: async (stepId) => {
        const response = await api.get(`${ADMIN_BASE_URL}/${stepId}/`);
        return response.data;
    },

    /**
    * Updates an existing recipe step by its ID (for administrators). Requires admin authentication.
    * Uses PATCH for partial updates.
    * PATCH /api/admin/steps/<int:pk>/
    * @param {number} stepId - The ID of the step to update.
    * @param {object} stepData - An object containing the step data to update.
    * Can include `order` (int), `description` (string), and `recipe` (int, the ID of the parent recipe).
    * @returns {Promise<object>} A promise that resolves with the updated step object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateStepAdmin: async (stepId, stepData) => {
        const response = await api.patch(`${ADMIN_BASE_URL}/${stepId}/`, stepData);
        return response.data;
    },

    /**
    * Deletes a recipe step by its ID (for administrators). Requires admin authentication.
    * DELETE /api/admin/steps/<int:pk>/
    * @param {number} stepId - The ID of the step to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the step is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteStepAdmin: async (stepId) => {
        await api.delete(`${ADMIN_BASE_URL}/${stepId}/`);
        return true;
    }
};