import api from "../Service/axios";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserType = () => {
  return localStorage.getItem("userType");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");
};

export const logout = async () => {
  try {
    await api.post("/users/logout");
  } catch (err) {
    console.log(err);
  } finally {
    clearAuth();
  }
};