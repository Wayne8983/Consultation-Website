import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUserType, restoreSession } from "../Utils/auth";

const ProtectedRoute = ({ children, role }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        let token = getToken();
        let userType = getUserType();

        if (!token) {
          const session = await restoreSession();
          token = session?.token;
          userType = session?.userType;
        }

        if (cancelled) return;

        setAllowed(!!token && (!role || userType === role));
      } catch {
        if (cancelled) return;
        setAllowed(false);
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [role]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;