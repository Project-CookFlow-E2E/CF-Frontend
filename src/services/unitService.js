import api from './api';
/**
 * src/services/unitService.js
 *
 * Provides service methods for interacting with Unit API endpoints.
 * This service allows public access for reading units and administrator access for CRUD operations.
 *
 * @module unitService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for Unit API endpoints.
 * Corresponds to `/api/units/` in the backend router.
 * 
 * @type {string}
 */
const BASE_URL = "/units";

/**
 * Service for interacting with Unit API endpoints.
 */
export const unitService = {

     /**
    * Fetches a list of all measurement units.
    * GET /api/units/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of Unit objects.
    * @throws {Error} If the API request fails.
    */
    getAllUnits: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    /**
    * Fetches the details of a specific measurement unit by its ID.
    * GET /api/units/<int:pk>/
    * 
    * @param {number} unitId - The ID of the unit to fetch.
    * @returns {Promise<object>} A promise that resolves with the Unit's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found).
    */
    getUnitById: async (unitId) => {
        const response = await api.get(`${BASE_URL}/${unitId}/`);
        return response.data;
    },

    // --- Admin-specific methods ---

    /**
    * Creates a new measurement unit (for administrators).
    * POST /api/units/
    * 
    * @param {object} unitData - An object containing the data for the new unit.
    * Expected fields for Unit: `name` (str), `abbreviation` (str), `unit_type` (int ID of UnitType).
    * @returns {Promise<object>} A promise that resolves with the newly created Unit object.
    * @throws {Error} If the API request fails (e.g., validation errors, 403 Forbidden for non-admins, 401 Unauthorized if not logged in).
    */
    createUnit: async (unitData) => {
        const response = await api.post(`${BASE_URL}/`, unitData);
        return response.data;
    },

    /**
    * Updates an existing measurement unit by its ID (for administrators).
    * Uses PATCH for partial updates.
    * PATCH /api/units/<int:pk>/
    * 
    * @param {number} unitId - The ID of the unit to update.
    * @param {object} unitData - An object containing the data to update.
    * Can include `name` (str), `abbreviation` (str), `unit_type` (int ID).
    * @returns {Promise<object>} A promise that resolves with the updated Unit object.
    * @throws {Error} If the API request fails (e.g., validation errors, 404 Not Found, 403 Forbidden).
    */
    updateUnit: async (unitId, unitData) => {
        const response = await api.put(`${BASE_URL}/${unitId}/`, unitData);
        return response.data;
    },

    /**
    * Deletes a measurement unit by its ID (for administrators).
    * DELETE /api/units/<int:pk>/
    * @param {number} unitId - The ID of the unit to delete.
    * @returns {Promise<boolean>} A promise that resolves with `true` if the unit is successfully deleted.
    * @throws {Error} If the API request fails (e.g., 404 Not Found, 403 Forbidden).
    */
    deleteUnit: async (unitId) => {
        await api.delete(`${BASE_URL}/${unitId}/`);
        return true;
    }

};