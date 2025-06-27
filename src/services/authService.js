/**
 * authService.js
 *
 * Provides authentication utility functions for login, logout, token storage,
 * and JWT validation (expiration check) for client-side auth flows.
 *
 * Features:
 * - Stores JWT tokens in localStorage under a fixed key.
 * - Decodes and validates token expiration using `jwt-decode`.
 * - Interfaces with an Axios instance (`api`) to perform login requests.
 *
 * Example usage:
 * import * as authService from './authService';
 *
 * // To log in:
 * const authData = await authService.login('username', 'password');
 * console.log('Access JWT:', authData.access);
 *
 * // To get tokens:
 * const accessToken = authService.getToken();
 * const refreshToken = authService.getRefreshToken();
 *
 * // To validate the access token:
 * const isValid = authService.isTokenValid();
 *
 * // To refresh the access token:
 * const newAccessToken = await authService.refreshAuthToken();
 *
 * // To log out:
 * authService.logout();
 *
 * @module authService
 * @requires ./api
 * @requires jwt-decode
 * @author Nico
 * @modified by Saturnino
 * @modified by Ana Castro
 * @modified Added function getUserIdFromToken() to obtain user ID through token
 *
 */
import api from "./api";
import { jwtDecode } from "jwt-decode";

/**
 * Key used to store the JWT access token in localStorage.
 *
 * @type {"cookflow_accessToken"}
 */
const ACCESS_TOKEN_KEY = "cookflow_accessToken";
/**
 * Key used to store the JWT refresh token in localStorage.
 *
 * @type {"cookflow_refreshToken"}
 */
const REFRESH_TOKEN_KEY = "cookflow_refreshToken";

/**
 * Performs a login request to the backend to obtain JWT tokens.
 * Stores the access token and refresh token in localStorage upon successful authentication.
 *
 * @async
 * @param {string} username - The username/email for login.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} An object containing the access and refresh tokens, along with any other data from the backend.
 * @throws {object} If the server responds with validation errors (HTTP 4xx/5xx status),
 * the error object will be the `error.response.data` from Axios,
 * containing specific error messages (e.g., `{ "password": ["..."], "detail": "..." }`).
 * @throws {Error} If no response is received from the server (e.g., network error),
 * or if an unexpected error occurs during the request setup.
 */
export const login = async (username, password) => {
  try {
    const res = await api.post("/token/", { username, password });
    const accessToken = res.data.access;
    const refreshToken = res.data.refresh;
    if (res.status === 200 && accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      window.dispatchEvent(new Event("authchange"));
    }
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "Authentication error or backend validation failed:",
        error.response.data
      );
      console.error("Status code:", error.response.status);
      const errorMessage = error.response.data.detail || JSON.stringify(error.response.data) || "Authentication failed.";
      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
      throw new Error(
        "No response received from the server. Please check your network connection."
      );
    } else {
      console.error("Error during authentication request:", error.message);
      throw new Error("An error occurred during the authentication request.");
    }
  }
};

/**
 * Retrieves the JWT access token from localStorage.
 *
 * @returns {string | null} The access token if it exists, otherwise null.
 */
export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Retrieves the JWT refresh token from localStorage.
 *
 * @returns {string | null} The refresh token if it exists, otherwise null.
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Checks if the stored JWT access token is valid and has not expired.
 *
 * @returns {boolean} `true` if the token is valid and not expired.
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch (error) {
    console.error("Error decoding or validating token:", error);
    return false;
  }
};

/**
 * Logs out the user by removing both access and refresh tokens from localStorage.
 * This function does not perform a backend call, as JWTs are inherently stateless.
 * It is recommended to add backend logic to invalidate the refresh token if necessary
 * for enhanced security (e.g., refresh token blocklisting).
 *
 * @async
 * @returns {void}
 */
export const logout = async () => {
  const refreshToken = getRefreshToken();

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event("authchange"));

  if (refreshToken) {
    try {
      await api.post("/logout/", { refresh: refreshToken });
    } catch (err) {
      console.error("Error blacklisting refresh token on the server:", err);
    }
  } else {
    console.warn("No refresh token found for server-side logout.");
  }
};

/**
 * Attempts to refresh the access token using the stored refresh token.
 * If successful, it updates the access token in localStorage.
 * If it fails (e.g., invalid or expired refresh token), it logs out the user.
 *
 * @async
 * @returns {Promise<string | boolean>} The new access token if successfully refreshed,
 * or `false` if no refresh token is available.
 * @throws {Error} If the token refresh request fails for other reasons.
 */
export const refreshAuthToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.warn("No refresh token available.");
      return false;
    }
    const res = await api.post("/token/refresh/", { refresh: refreshToken });
    const newAccessToken = res.data.access;
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    logout();
    throw error;
  }
};

/**
 * Decodes the stored access token to extract and return the user's ID.
 *
 * @returns {number} The user ID from the token.
 * @throws {Error} If no token is found in localStorage.
 */
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("cookflow_accessToken");
  if (!token) {
    throw new Error("Token not found");
  }

  const decoded = jwtDecode(token);
  return decoded.user_id;
};
