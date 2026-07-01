let accessToken = null;

const USER_KEY = "user";
const USER_TYPE_KEY = "userType";

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const setStoredUserType = (userType) => {
  if (userType) {
    sessionStorage.setItem(USER_TYPE_KEY, userType);
  }
};

export const getStoredUserType = () => {
  return sessionStorage.getItem(USER_TYPE_KEY);
};

export const setStoredUser = (user) => {
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getStoredUser = () => {
  const user = sessionStorage.getItem(USER_KEY);

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = ({ token, userType, user }) => {
  setAccessToken(token);
  setStoredUserType(userType);
  setStoredUser(user);

  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");
};

export const clearAuthSession = () => {
  clearAccessToken();

  sessionStorage.removeItem(USER_TYPE_KEY);
  sessionStorage.removeItem(USER_KEY);

  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");
};