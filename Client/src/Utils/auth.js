import api, { refreshSession } from "../Service/axios";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  getStoredUserType,
} from "./authSession";

export const getToken = () => {
  return getAccessToken();
};

export const getUserType = () => {
  return getStoredUserType();
};

export const getUser = () => {
  return getStoredUser();
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const restoreSession = async () => {
  const session = await refreshSession();
  return session;
};

export const clearAuth = () => {
  clearAuthSession();
};

export const logout = async () => {
  try {
    await api.post("/users/logout");
  } catch (err) {
    console.log(err);
  } finally {
    clearAuthSession();
  }
};