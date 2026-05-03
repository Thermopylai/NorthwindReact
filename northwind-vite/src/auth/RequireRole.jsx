import { useAuth } from "./useAuth";

const RequireRole = ({ role, children, fallback = null }) => {
  const { hasRole } = useAuth();
  
  return hasRole(role) ? children : fallback;
};

export default RequireRole;