import axios from "axios";
const BackendURL = import.meta.env.VITE_BackendURL;

const api = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: BackendURL,
  withCredentials: true,
});

const clearAuthAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

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

    const isRefreshRequest = originalRequest.url?.includes("/users/refresh-token");

    if (isRefreshRequest) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("token")
    ) {
      originalRequest._retry = true;

      try {
        const response = await refreshApi.post("/users/refresh-token");
        const newToken = response.data.token;

        localStorage.setItem("token", newToken);

        if (response.data.userType) {
          localStorage.setItem("userType", response.data.userType);
        }

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

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