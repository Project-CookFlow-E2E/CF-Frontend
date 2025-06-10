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
 * @modified by Saturnino Méndez
 */
import axios from "axios";
import { getToken, refreshAuthToken, logout } from "../services/authService"
import { globalNavigate } from '../main';

/**
 * The base URL for the API, obtained from environment variables.
 * 
 * @type {string}
 */
const apiUrl = import.meta.env.VITE_API_URL || "";

/**
 * Axios instance configured for API requests, handling authentication and token refreshing.
 * 
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: apiUrl,
});

/**
 * Request Interceptor:
 * Automatically adds the JWT Access Token to the Authorization header of outgoing requests.
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Handles responses, specifically 401 Unauthorized errors for token refreshing and request retries.
 * Logs out the user if token refresh fails.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    // Check if the error is 401 Unauthorized, not for the token refresh endpoint itself,
    // and if it hasn't been retried already.
    if (status === 401 && originalRequest.url !== "/token/refresh/" && !originalRequest._retry){
      originalRequest._retry = true; // Mark the request as retried to prevent infinite loops
      try {
        console.warn("Access token expired or unauthorized, attempting to refresh token...");
        const newAccessToken = await refreshAuthToken(); // Attempt to get a new access token

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refreshing fails (e.g., refresh token is also invalid/expired), log the user out
        console.error("Failed to refresh token. Logging out.", refreshError);
        logout(); // Clean un tokens from localStorage
        globalNavigate('/'); // Redirect to the home page
      }
  }
  // For any other errors, or if the refresh attempt failed, or if it's already retried,
  // or if the original error was not 401, simply reject the promise.
  return Promise.reject(error);
  } 
);

export default api;