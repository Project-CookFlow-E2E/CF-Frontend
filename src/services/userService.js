import api from "./api";

/**
 * src/services/userService.js
 *
 * Provides service methods for interacting with user-related API endpoints.
 * This includes fetching user profiles (current and by ID), updating profiles,
 * and administrative operations (listing, creating, updating, deleting users).
 *
 * @module userService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for regular user-related API endpoints.
 * Corresponds to `/api/users/` in the backend.
 *
 * @type {string}
 */
const BASE_URL = "/users";
/**
 * Base URL for administrator-specific user API endpoints.
 * Corresponds to `/api/admin/users/` in the backend.
 *
 * @type {string}
 */
const ADMIN_BASE_URL = "/admin/users";

/**
 * Service for interacting with favorite API endpoints.
 * Provides methods for managing user favorites and administrative favorite operations.
 */
export const userService = {

    /**
    * Fetches the profile of the currently authenticated user.
    * GET /api/users/me/
    * 
    * @returns {Promise<object>} A promise that resolves with the authenticated user's profile data.
    * @throws {Error} If the API request fails (e.g., 401 Unauthorized if not logged in).
    */
    getMe: async () => {
        const response = await api.get(`${BASE_URL}/me/`);
        return response.data;
    },

    /**
    * Updates the profile of the currently authenticated user.
    * Uses PATCH for partial updates, but can be changed to PUT if full updates are required.
    * PATCH /api/users/me/
    * 
    * @param {object} userData - An object containing the user data to update (e.g., { email: 'new@example.com' }).
    * @returns {Promise<object>} A promise that resolves with the updated user profile data.
    * @throws {Error} If the API request fails (e.g., validation errors, 401 Unauthorized).
    */
    updateMe: async (userData) => {
        const response = await api.patch(`${BASE_URL}/me/`, userData);
        return response.data;
    },

    /**
    * Fetches the details of a specific user by their ID.
    * This is typically for viewing public profiles or by other authenticated users.
    * GET /api/users/<int:pk>/
    * 
    * @param {number} userId - The ID of the user to fetch.
    * @returns {Promise<object>} A promise that resolves with the user's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 401 Unauthorized).
    */
    getUserById: async (userId) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        const response = await api.get(`${BASE_URL}/${userId}/`);
        return response.data;
    },

    /**
    * Creates a new user (for non-administrators).
    * This method is typically used for user registration.
    * POST /api/register/
    * 
    * @param {object} userData - An object containing the data for the new user (e.g., { username: 'newuser', password: 'password' }).
    * @returns {Promise<object>} A promise that resolves with the newly created user object.
    * @throws {Error} If the API request fails.
    *
    * @author Ángel Aragón
    */
    createUser: async (userData) => {
        console.log("Creating user with data:", userData);
        const response = await api.post(`/register/`, userData);
        return response.data;
    },

    // --- Admin-specific methods ---

    /**
    * Fetches the details of a specific user by their ID (for administrators).
    * This method requires administrator privileges.
    * GET /api/admin/users/<int:pk>/
    * 
    * @param {number} userId - The ID of the user to fetch.
    * @returns {Promise<object>} A promise that resolves with the user's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    getUserByIdAdmin: async (userId) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        const response = await api.get(`${ADMIN_BASE_URL}/${userId}/`);
        return response.data;
    },

    /**
    * Fetches a list of all users.
    * This method requires administrator privileges.
    * GET /api/admin/users/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of user objects.
    * @throws {Error} If the API request fails (e.g., 403 Forbidden for non-admins).
    */
    getAllUsersAdmin: async () => {
        const response = await api.get(`${ADMIN_BASE_URL}/`);
        return response.data;
    },

    /**
    * Creates a new user (for administrators).
    * This method requires administrator privileges.
    * POST /api/admin/users/
    * 
    * @param {object} userData - An object containing the data for the new user.
    * @returns {Promise<object>} A promise that resolves with the newly created user object.
    * @throws {Error} If the API request fails (e.g., validation errors, 403 Forbidden).
    */
    createUserAdmin: async (userData) => {
        const response = await api.post(`${ADMIN_BASE_URL}/`, userData);
        return response.data;
    },
    
    /**
    * Updates an existing user by their ID (for administrators).
    * Uses PATCH for partial updates, but can be changed to PUT for full updates.
    * This method requires administrator privileges.
    * PATCH /api/admin/users/<int:pk>/
    * 
    * @param {number} userId - The ID of the user to update.
    * @param {object} userData - An object containing the user data to update.
    * @returns {Promise<object>} A promise that resolves with the updated user object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateUserAdmin: async (userId, userData) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        const response = await api.patch(`${ADMIN_BASE_URL}/${userId}/`, userData);
        return response.data;
    }, 

    /**
    * Deletes a user by their ID (for administrators).
    * This method requires administrator privileges.
    * DELETE /api/admin/users/<int:pk>/
    * 
    * @param {number} userId - The ID of the user to delete.
    * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
    * No data is typically returned for a successful DELETE.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteUserAdmin: async (userId) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        await api.delete (`${ADMIN_BASE_URL}/${userId}/`);
        return true;
    }

};
