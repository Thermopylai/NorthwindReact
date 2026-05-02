import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <p>Ladataan kirjautumistietoja...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
