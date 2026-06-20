import { Navigate } from "react-router-dom";
import { getToken, getUserType } from "../Utils/auth";



const ProtectedRoute = ({ children, role }) => {
  const token = getToken();
  const userType = getUserType();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (role && userType !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;