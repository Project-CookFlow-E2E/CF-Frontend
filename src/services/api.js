import axios from 'axios';
import { getToken, isTokenValid } from "../services/authService";

const apiUrl = import.meta.env.VITE_API_URL || "";

console.log("API_BASE_URL used in api.js:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    }
    else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.request.use(
  (config) => {
    const excludeAuthHeaderUrls = [
      `${apiUrl}/token/`,
      `/token/`,
      `${apiUrl}/token/refresh/`,
      `/token/refresh/`,
    ];

    const isAuthHeaderExcluded = excludeAuthHeaderUrls.some(url => config.url.includes(url));

    if (!isAuthHeaderExcluded) {
      const token = getToken();
      if (token && isTokenValid()) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;

    const excludeUrls = [
      `${apiUrl}/token`,
      `/token`,
      `${apiUrl}/token/refresh`,
      `/token/refresh`,
    ];
    const isExcludedUrl = excludeUrls.some(url => originalRequest.url.includes(url));
    
    if (status === 401 && !isExcludedUrl && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          console.warn("Access token expired or unauthorized. Attempting to refresh token...");
          const { refreshAuthToken, logout } = await import('../services/authService'); 
          const newAccessToken = await refreshAuthToken(); 
          
          if (newAccessToken === false){
            console.error("Refresh token not available (refreshAuthToken returned false). Logging out.");
            logout();
            isRefreshing = false;
            processQueue(new Error("No refresh token available."), null);
            return Promise.reject(new Error("No refresh token available."));
          };

          isRefreshing = false;
          processQueue(null, newAccessToken); 

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);

        } 
        catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null); 

          console.error("Failed to refresh token. Logging out.", refreshError);
          const { logout } = await import('../services/authService'); 
          logout();
          return Promise.reject(refreshError);
        };
      };

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }
    return Promise.reject(error);
  }
);

export default api;
