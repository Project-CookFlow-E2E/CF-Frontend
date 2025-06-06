import { create } from "zustand";
import * as authService from '../services/authService';

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
