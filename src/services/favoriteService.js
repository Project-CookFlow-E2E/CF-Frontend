import api from './api';
import { getUserIdFromToken } from './authService';

/**
* src/services/favoriteService.js
*
* Provides service methods for interacting with favorite-related API endpoints.
* This includes managing favorites for the authenticated user (adding, listing, removing)
* and administrative operations on favorites (listing all, creating, updating, deleting for any user).
*
* @module favoriteService
* @requires ./api - The configured Axios instance for making API requests.
* @author Saturnino Mendez
* @modified by Ana Castro
* @description This service provides methods to manage user favorites and administrative operations on favorites.
*/

/**
* Base URL for regular user-related API endpoints.
* Corresponds to `/api/favorites/` in the backend.
* 
* @type {string}
*/
const BASE_URL = '/favorites/';

/**
 * Base URL for administrator-specific favorite API endpoints.
 * Corresponds to `/api/admin/favorites` in the backend.
 * 
 * @type {string}
 */
const ADMIN_BASE_URL = '/admin/favorites';

/**
 * Description placeholder
 *
 * @type { getUserFavorites: () => unknown; addFavorite: (favoriteId: any) => unknown; removeFavorite: (favoriteId: any) => unknown; getAllFavoritesAdmin: () => unknown; createFavoriteAdmin: (favoriteData: any) => unknown; getFavoriteByIdAdmin: (favoriteId: any) => unknown; updateFavoriteAdmin: (favoriteId: any, favoriteData...}
 */
export const favoriteService = {

    /**
    * Fetches the list of favorites for the currently authenticated user.
    * GET /api/favorites/
    * Each favorite object typically includes details about the associated recipe.
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of favorite objects.
    * @throws {Error} If the API request fails (e.g., 401 Unauthorized if not logged in).
    */
    getUserFavorites: async () => {
        const response = await api.get(`${BASE_URL}`);
        return response.data;
    },

    /**
    * Adds a recipe to a user's favorites.
    * GET /api/favorites/
    * @async
    * @param {number} recipeId - The unique identifier of the recipe to be added to favorites.
    * @returns {Promise<object>} A promise that resolves to the data returned by the API after successfully adding the favorite.
    * @throws {Error} If the API request fails (e.g., network error, server error, or issues with token retrieval).
    */
    addFavorite: async (recipeId) => {
        const userId = getUserIdFromToken();
        const data = {
            user_id: userId,
            recipe_id: recipeId  
        };
        
        const response = await api.post(`${BASE_URL}`, data); 
        return response.data;
    },

    /**
    * Removes a favorite from the authenticated user's list by its favorite ID.
    * DELETE /api/favorites/<int:pk>/
    * 
    * @param {number} favoriteId - The ID of the favorite entry to remove (not the recipe ID).
    * @returns {Promise<void>} A promise that resolves when the favorite is successfully removed.
    * No data is typically returned for a successful DELETE.
    * @throws {Error} If the API request fails (e.g., 404 Not Found if favorite doesn't exist, 401 Unauthorized).
    */
    removeFavorite: async (favoriteId) => {
        if (typeof favoriteId !== 'number' || isNaN(favoriteId) || favoriteId < 1) {
            return Promise.reject(new Error("favorite id not valid."));
        };
        await api.delete(`${BASE_URL}${favoriteId}/`);
        return true;
    },

    // --- Admin-specific methods ---

    /**
    * Fetches a list of all favorite entries across all users.
    * This method requires administrator privileges.
    * GET /api/admin/favorites
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of all favorite objects.
    * @throws {Error} If the API request fails (e.g., 403 Forbidden for non-admins).
    */
    getAllFavoritesAdmin: async () => {
        const response = await api.get(`${ADMIN_BASE_URL}`);
        return response.data;
    },

    /**
    * Creates a new favorite entry for a specific user.
    * This method requires administrator privileges and allows an admin to assign a favorite to any user.
    * POST /api/admin/favorites
    * 
    * @param {object} favoriteData - The data for the new favorite. Typically `{ user: number, recipe: number }`
    * where `user` is the ID of the user and `recipe` is the ID of the recipe.
    * @returns {Promise<object>} A promise that resolves with the newly created favorite object.
    * @throws {Error} If the API request fails (e.g., validation errors, 403 Forbidden).
    */
    createFavoriteAdmin: async (favoriteData) => {
        const response = await api.post(`${ADMIN_BASE_URL}`, favoriteData);
        return response.data;
    },

    /**
    * Fetches the details of a specific favorite entry by its ID.
    * This method requires administrator privileges.
    * GET /api/admin/favorites/<int:pk>/
    * 
    * @param {number} favoriteId - The ID of the favorite entry to fetch.
    * @returns {Promise<object>} A promise that resolves with the details of the favorite entry.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    getFavoriteByIdAdmin: async (favoriteId) => {
        if (typeof favoriteId !== 'number' || isNaN(favoriteId) || favoriteId < 1) {
            return Promise.reject(new Error("favorite id not valid."));
        };
        const response = await api.get(`${ADMIN_BASE_URL}/${favoriteId}/`);
        return response.data;
    },

    /**
    * Updates an existing favorite entry by its ID.
    * This method requires administrator privileges and allows an admin to modify a favorite.
    * PATCH /api/admin/favorites/<int:pk>/ (or PUT, depending on backend implementation)
    * 
    * @param {number} favoriteId - The ID of the favorite entry to update.
    * @param {object} favoriteData - The data to update (e.g., `{ user: newUserId, recipe: newRecipeId }`).
    * @returns {Promise<object>} A promise that resolves with the updated favorite object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateFavoriteAdmin: async (favoriteId, favoriteData) => {
        if (typeof favoriteId !== 'number' || isNaN(favoriteId) || favoriteId < 1) {
            return Promise.reject(new Error("favorite id not valid."));
        };
        const response = await api.patch(`${ADMIN_BASE_URL}/${favoriteId}/`, favoriteData);
        return response.data;
    },

    /**
    * Deletes a favorite entry by its ID.
    * This method requires administrator privileges.
    * DELETE /api/admin/favorites/<int:pk>/
    * 
    * @param {number} favoriteId - The ID of the favorite entry to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the favorite is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteFavoriteAdmin: async (favoriteId) => {
        if (typeof favoriteId !== 'number' || isNaN(favoriteId) || favoriteId < 1) {
            return Promise.reject(new Error("favorite id not valid."));
        };
        const response = await api.delete(`${ADMIN_BASE_URL}/${favoriteId}/`);
        return true;
    }

};