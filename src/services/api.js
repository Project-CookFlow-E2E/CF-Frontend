/**
 * api.js
 *
 * Axios instance configured with baseURL from environment.
 *
 * - Uses the VITE_API_URL environment variable (or an empty string by default).
 * - Serves as the centralized instance for all HTTP requests in the app.
 *
 * Example usage:
 * import api from './api';
 * api.get('/path');
 *
 * @module api
 * @requires axios
 * @author Nico
 */
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "";

const token = localStorage.getItem("TOKEN_KEY");

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  }
});

export default api;
