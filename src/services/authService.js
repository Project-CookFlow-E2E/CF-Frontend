import api from "./api";
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

export const logout = async () => {
  localStorage.removeItem(TOKEN_KEY);
};
