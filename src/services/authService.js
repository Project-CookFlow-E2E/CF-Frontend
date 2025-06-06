import api from "./api";
import jwt_decode from "jwt-decode";

const TOKEN_KEY = "TOKEN_KEY";

export const login = async (username, password) => {
  try {
    const res = await api.post("/login", { username, password });
    const token = res.data.token;
    if (res.status === 200 && token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    return res.data;
  } catch (error) {
    console.error(`Error logging in: ${error.message}`);
    throw error;
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const { exp } = jwt_decode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

export const logout = async () => {
  localStorage.removeItem(TOKEN_KEY);
};


