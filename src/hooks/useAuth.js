import { useState, useEffect } from "react";
import * as authService from "../services/authService";

export function useAuth() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = authService.getToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    if (data?.token) {
      setToken(data.token);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
  };

  const isAuthenticated = !!token;

  return {
    token,
    login,
    logout,
    isAuthenticated,
  };
}
