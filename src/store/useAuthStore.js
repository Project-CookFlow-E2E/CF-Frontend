
import { create } from "zustand";
import * as authService from "../services/authService";
/**
 * useAuthStore.js
 *
 * Zustand store to manage user authentication state using JWT.
 *
 * Features:
 * - Stores and retrieves JWT tokens from localStorage.
 * - Validates tokens using authService's isTokenValid.
 * - Exposes login and logout methods using authService internally.
 *
 * Example usage:
 * const { login, logout, isAuthenticated } = useAuthStore();
 *
 * @module useAuthStore
 * @typedef {Object} AuthState
 * @property {string|null} token - JWT token retrieved from localStorage.
 * @property {boolean} isAuthenticated - Whether the current token is valid.
 * @property {(username: string, password: string) => Promise<Object>} login - Performs login, updates token and auth status.
 * @property {() => void} logout - Logs out the user and clears the token.
 * @author Nico
 */
export const useAuthStore = create((set) => ({
  token: authService.getToken(),
  isAuthenticated: authService.isTokenValid(),
  login: async (username, password) => {
    try {
      const data = await authService.login(username, password);
      if (data.token) {
        set({ token: data.token, isAuthenticated: authService.isTokenValid() });
      }
      return data;
    } catch (error) {
      console.error(`Error logging in: ${error.message}`);
      throw error;
    }
  },
  logout: () => {
    authService.logout();
    set({ token: null, isAuthenticated: false });
  },
}));
