import api from "./api";
/**
 * src/services/unitTypeService.js
 *
 * Provides service methods for interacting with UnitType API endpoints.
 * This service only allows reading unit types, as they are considered fixed data
 * managed directly in the database or through mechanisms outside the public API.
 *
 * @module unitTypeService
 * @requires ./api - The configured Axios instance for making API requests.
 * @author Saturnino Mendez
 */

/**
 * Base URL for UnitType API endpoints.
 * Corresponds to `/api/measurements/unit-types/` in your backend router.
 * 
 * @type {string}
 */
const BASE_URL = "/measurements/unit-types";

/**
 * Service for interacting with UnitType API endpoints.
 */
export const unitTypeService = {

    /**
    * Fetches a list of all measurement unit types.
    * GET /api/measurements/unit-types/
    * 
    * @returns {Promise<Array<object>>} A promise that resolves with an array of UnitType objects.
    * @throws {Error} If the API request fails.
    */
    getAllUnitTypes: async () => {
        const response = await api.get(`${BASE_URL}/`);
        return response.data;
    },

    /**
    * Fetches the details of a specific measurement unit type by its ID.
    * GET /api/measurements/unit-types/<int:pk>/
    * @param {number} unitTypeId - The ID of the unit type to fetch.
    * @returns {Promise<object>} A promise that resolves with the UnitType's data.
    * @throws {Error} If the API request fails (e.g., 404 Not Found) or unit_type id is not valid.
    */
    getUnitTypeById: async (unitTypeId) => {
        if (typeof unitTypeId !== 'number' || isNaN(unitTypeId) || unitTypeId < 1) {
            return Promise.reject(new Error("unitType id not valid."));
        }
        const response = await api.get(`${BASE_URL}/${unitTypeId}`);
        return response.data;
    }

};