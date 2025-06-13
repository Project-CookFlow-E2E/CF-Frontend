import api from "./api";
/**
 * src/services/shoppingListItemService.js
 *
 * Provides service methods for interacting with ShoppingListItem API endpoints.
 * These endpoints allow users (authenticated) to manage their personal shopping list items,
 * and administrators to manage all shopping list items.
 *
 * @module shoppingListItemService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for ShoppingListItem API endpoints.
 * Corresponds to `/api/shopping/items/` based on your Django REST Framework router configuration.
 * This endpoint handles both standard user and admin access based on backend permissions and serializer logic.
 * 
 * @type {string}
 */
const BASE_URL = '/shopping/items';

/**
 * Service for interacting with ShoppingListItem API endpoints.
 */
export const shoppingListItemService = {
    // --- Authenticated User Methods ---
    // All methods require user authentication, as per ShoppingListItemView's permission_classes.

    /**
    * Fetches the details of a specific shopping list item by its ID.
    * Standard users can only fetch their own items. Administrators can fetch any item.
    * GET /api/shopping/items/<int:pk>/
    * 
    * @param {number} itemId - The ID of the shopping list item to fetch.
    * @returns {Promise<object>} A promise that resolves with the item's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found if item doesn't exist or doesn't belong to the user/admin, 401 Unauthorized).
    */
    getShoppingListItemById: async (itemId) => {
        const response = await api.get(`${BASE_URL}/${itemId}`);
        return response.data;  
    },

    /**
    * Fetches a list of shopping list items.
    * For standard users, this returns only their own shopping list items.
    * For administrators, this returns all shopping list items in the system.
    * GET /api/shopping/items/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of ShoppingListItem objects.
    * @throws {Error} If the API request fails (e.g., 401 Unauthorized if not logged in).
    */
    getAllShoppingListItems: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    /**
    * Creates a new shopping list item.
    * The backend will automatically assign the `user_id` to the authenticated user.
    * POST /api/shopping/items/
    * 
    * @param {object} itemData - An object containing the data for the new item.
    * Must include `ingredient_id` (int ID of the ingredient), `quantity_needed` (int), `unit` (str), and `is_purchased` (bool).
    * @returns {Promise<object>} A promise that resolves with the newly created ShoppingListItem object.
    * @throws {Error} If the API request fails (e.g., validation errors, 401 Unauthorized).
    */
    createShoppingListItem: async (itemData) => {
        const response = await api.post(`${BASE_URL}/`, itemData);
        return response.data;
    },

    /**
   * Updates an existing shopping list item by its ID.
   * Users can only update their own items. Administrators can update any item.
   * Uses PATCH for partial updates.
   * PATCH /api/shopping/items/<int:pk>/
   * 
   * @param {number} itemId - The ID of the shopping list item to update.
   * @param {object} itemData - An object containing the data to update.
   * Can include `ingredient_id` (int ID), `quantity_needed` (int), `unit` (str), `is_purchased` (bool).
    * @returns {Promise<object>} A promise that resolves with the updated ShoppingListItem object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 401 Unauthorized, 403 Forbidden).
    */
    updateShoppingListItem: async (itemId, itemData) => {
        const response = await api.put(`${BASE_URL}/${itemId}/`, itemData);
        return response.data;
    },

    /**
    * Deletes a shopping list item by its ID.
    * Users can only delete their own items. Administrators can delete any item.
    * DELETE /api/shopping/items/<int:pk>/
    * 
    * @param {number} itemId - The ID of the shopping list item to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the item is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 401 Unauthorized, 403 Forbidden).
    */
    deleteShoppingListItem: async (itemId) => {
        await api.delete(`${BASE_URL}/${itemId}/`);
        return true;
    }
};