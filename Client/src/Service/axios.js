import axios from "axios";
import {
  clearAuthSession,
  getAccessToken,
  setAuthSession,
} from "../Utils/authSession";

const BackendURL = import.meta.env.VITE_BackendURL;

const api = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
});

let refreshPromise = null;

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/users/refresh-token")
      .then((response) => {
        setAuthSession({
          token: response.data.token,
          userType: response.data.userType,
          user: response.data.user,
        });

        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const clearAuthAndRedirect = () => {
  clearAuthSession();
  redirectToLogin();
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url?.includes(
      "/users/refresh-token"
    );

    if (isRefreshRequest) {
      clearAuthSession();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await refreshSession();

        originalRequest.headers.Authorization = `Bearer ${session.token}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;