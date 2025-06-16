import api from "./api";
/**
 * src/services/categoryService.js
 *
 * Provides service methods for interacting with recipe category API endpoints.
 * This includes fetching all categories for general users (read-only)
 * and comprehensive CRUD operations for categories for administrators.
 *
 * @module categoryService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for general recipe category API endpoints.
 * Corresponds to `/api/recipes/categories/` in the backend.
 * @type {string}
 */
const BASE_URL = "/recipes/categories";

/**
 * Service for interacting with recipe category API endpoints.
 */
export const categoryService = {
    // --- General User/Public methods (ReadOnly) ---

    /**
    * Fetches the details of a specific recipe category by its ID.
    * GET /api/recipes/categories/<int:pk>/
    * 
    * @param {number} categoryId - The ID of the category to fetch.
    * @returns {Promise<object>} A promise that resolves with the category's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found).
    */
    getCategoryById: async (categoryId) => {
        if (typeof categoryId !== 'number' || isNaN(unitTypeId) || unitTypeId < 1) {
            return Promise.reject(new Error("unit_type_id not valid."));
        }
        const response = await api.get(`${BASE_URL}/${categoryId}`);
        return response.data;
    },

    /**
    * Fetches a list of all recipe categories.
    * GET /api/recipes/categories/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of category objects.
    * Each object will include `id`, `name`, `user_id`, `parent_category_id`, and read-only `recipes` and `ingredients` lists.
    * @throws {Error} If the API request fails.
    */
    getAllCategories: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    /**
    * Fetches a list of all parent categories.
    * GET /api/recipes/categories/
    * 
    * @returns {Promise<object>} A promise that resolves with the category's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found).
    */
    getAllParentCategories: async () => {
        const response = await api.get(`${BASE_URL}/?parent_category_id=1`);
        return response.data;
    },

    /**
    * Fetches a list of all children categories for a specific parent category.
    * GET /api/recipes/categories/?parent_category_id=<int:parent_category_id>/
    * 
    * @returns {Promise<object>} A promise that resolves with the category's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found).
    */
    getChildCategoriesOfSpecificParent: async (parentCategoryId) => {
        if (typeof parentCategoryId !== 'number' || isNaN(parentCategoryId || parentCategoryId < 2)) {
            return Promise.reject(new Error("parent_category_id not valid."));
        }
        const response = await api.get(`${BASE_URL}/?parent_category_id=${parentCategoryId}`);
        return response.data;
    },

    // --- Admin-specific methods ---

    /**
    * Creates a new recipe category (for administrators).
    * POST /api/recipes/categories/
    * 
    * @param {object} categoryData - An object containing the data for the new category.
    * Must include `name` (str). Can optionally include `user_id` (int) and `parent_category_id` (int).
    * @returns {Promise<object>} A promise that resolves with the newly created category object.
    * @throws {Error} If the API request fails (e.g., validation errors, 403 Forbidden).
    */
    createCategoryAdmin: async (categoryData) => {
        const response = await api.post(`${BASE_URL}/`, categoryData);
        return response.data;
    },

    /**
    * Updates an existing recipe category by its ID (for administrators).
    * Uses PATCH for partial updates.
    * PATCH /api/recipes/categories/<int:pk>/
    * 
    * @param {number} categoryId - The ID of the category to update.
    * @param {object} categoryData - An object containing the category data to update.
    * Can include `name` (str), `user_id` (int), and `parent_category_id` (int).
    * @returns {Promise<object>} A promise that resolves with the updated category object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateCategoryAdmin: async (categoryId, categoryData) => {
        if (typeof categoryId !== 'number' || isNaN(categoryId) || categoryId < 1) {
            return Promise.reject(new Error("unit_type_id not valid."));
        };
        const response = await api.put(`${BASE_URL}/${categoryId}/`, categoryData);
        return response.data;
    },

    /**
    * Deletes a recipe category by its ID (for administrators).
    * DELETE /api/recipes/categories/<int:pk>/
    * 
    * @param {number} categoryId - The ID of the category to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the category is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteCategoryAdmin: async (categoryId) => {
        if (typeof categoryId !== 'number' || isNaN(categoryId) || categoryId < 1) {
            return Promise.reject(new Error("unit_type_id not valid."));
        };
        await api.delete(`${BASE_URL}/${categoryId}/`);
        return true;
    }
};