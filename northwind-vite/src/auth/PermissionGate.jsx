import { useAuth } from "./useAuth";

const PermissionGate = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  return hasPermission(permission) ? children : fallback;
};

export default PermissionGate;