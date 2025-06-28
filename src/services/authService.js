import api from "./api";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "cookflow_accessToken";
const REFRESH_TOKEN_KEY = "cookflow_refreshToken";
const PROCESSED_RECIPES_STORAGE_KEY = 'processedRecipeIds_inspireme_local';

export const login = async (username, password) => {
  try {
    const res = await api.post("/token/", { username, password });
    const accessToken = res.data.access;
    const refreshToken = res.data.refresh;

    if (res.status === 200 && accessToken) {
      localStorage.removeItem(PROCESSED_RECIPES_STORAGE_KEY);

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

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

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

export const logout = async () => {
  const refreshToken = getRefreshToken();

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PROCESSED_RECIPES_STORAGE_KEY);

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

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("cookflow_accessToken");
  if (!token) {
    throw new Error("Token not found");
  }

  const decoded = jwtDecode(token);
  return decoded.user_id;
};
