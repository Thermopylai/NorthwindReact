import { useEffect, useMemo, useState, useCallback } from "react";
import {
  clearAuthTokens,
  getAuthToken,
  getRefreshToken,
  getAccessTokenExpiresAt,
  getRefreshTokenExpiresAt,
  saveAuthTokens,
  isDateExpired,
  isDateExpiringSoon,
} from "./authStorage";
import {
  registerRequest,
  loginRequest,
  refreshRequest,
  logoutRequest,
  getAllUsersRequest,
  searchUsersRequest,
  listRolePermissionsRequest,
  resetPasswordRequest,
  assignRoleRequest,
  removeRoleRequest,
  deleteUserRequest,
  getUserInfoRequest,
  updateUserRequest,
  changePasswordRequest,
} from "../api/auth";
import { AuthContext } from "./authContextInstance";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isAuthLoading, setAuthLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    clearAuthTokens();
    setToken(null);
    setUser(null);
    setRolePermissions([]);
  }, []);

  const loadIdentity = useCallback(async (accessToken) => {
    if (!accessToken) {
      throw new Error("Ei tokenia, identiteettiä ei voi ladata.");
    }

    const userData = await getUserInfoRequest(accessToken);

    setUser(userData);
    setRolePermissions(userData.rolePermissions ?? userData.RolePermissions ?? []);
    return userData;
  }, []);

  const refreshAuthState = useCallback(async () => {
    const result = await refreshRequest();

    if (!result.success) {
      throw new Error("Virhe päivityksessä: " + result.message);
    }

    saveAuthTokens(result);
    setToken(result.accessToken);
    await loadIdentity(result.accessToken);
  }, [loadIdentity]);

  const userRoles = useMemo(() => {
    const roles = user?.roles ?? user?.Roles;

    if (Array.isArray(roles) && roles.length > 0) {
      return roles;
    }

    return rolePermissions
      .map((rp) => rp.roleName ?? rp.RoleName)
      .filter(Boolean);
  }, [user, rolePermissions]);

  const userPermissions = useMemo(() => {
    const permissions = user?.permissions ?? user?.Permissions;

    if (Array.isArray(permissions) && permissions.length > 0) {
      return permissions;
    }

    return [
      ...new Set(
        rolePermissions.flatMap((rp) => rp.permissions ?? rp.Permissions ?? []),
      ),
    ];
  }, [user, rolePermissions]);

  useEffect(() => {
    const init = async () => {
      setAuthLoading(true);
      try {
        const accessToken = getAuthToken();
        const refreshToken = getRefreshToken();
        const accessTokenExpiresAt = getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = getRefreshTokenExpiresAt();

        if (!accessToken || !refreshToken) {
          clearAuthState();
          return;
        }

        if (isDateExpired(refreshTokenExpiresAt)) {
          clearAuthState();
          return;
        }

        if (!isDateExpiringSoon(accessTokenExpiresAt, 60)) {
          setToken(accessToken);
          await loadIdentity(accessToken);
          return;
        }

        await refreshAuthState();
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuthState();
      } finally {
        setAuthLoading(false);
      }
    };

    init();
  }, [refreshAuthState, loadIdentity, clearAuthState]);

  useEffect(() => {
    if (!token) return;

    const accessTokenExpiresAt = getAccessTokenExpiresAt();
    const refreshTokenExpiresAt = getRefreshTokenExpiresAt();

    if (!accessTokenExpiresAt || !refreshTokenExpiresAt) return;

    if (isDateExpired(refreshTokenExpiresAt)) {
      clearAuthState();
      return;
    }

    const expiresAtMs = new Date(accessTokenExpiresAt).getTime();
    const nowMs = Date.now();

    // Refresh 60 sekuntia ennen access tokenin vanhenemista
    const refreshDelayMs = expiresAtMs - nowMs - 60_000;

    const timeoutId = setTimeout(
      async () => {
        try {
          await refreshAuthState();
        } catch (error) {
          console.error("Automatic token refresh failed:", error);
          clearAuthState();
        }
      },
      Math.max(refreshDelayMs, 0),
    );

    return () => clearTimeout(timeoutId);
  }, [token, refreshAuthState, clearAuthState]);

  const register = async (payload) => {
    const result = await registerRequest(payload);

    if (!result.success) {
      throw new Error("Virhe rekisteröinnissä: " + result.message);
    }

    saveAuthTokens(result);
    setToken(result.accessToken);
    await loadIdentity(result.accessToken);
  };

  const login = async (payload) => {
    const result = await loginRequest(payload);

    if (!result.success) {
      throw new Error("Virhe kirjautumisessa: " + result.message);
    }

    saveAuthTokens(result);
    setToken(result.accessToken);
    await loadIdentity(result.accessToken);
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Backend logout epäonnistui: ", error);
    } finally {
      clearAuthState();
      setAuthLoading(false);
    }
  };

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  const getAllUsers = async () => {
    return await getAllUsersRequest(token);
  };

  const searchUsers = async (params) => {
    return await searchUsersRequest(params, token);
  };

  const listRolePermissions = async () => {
    return await listRolePermissionsRequest(token);
  };

  const resetPassword = async (payload) => {
    return await resetPasswordRequest(payload, token);
  };

  const assignRole = async (payload) => {
    return await assignRoleRequest(payload, token);
  };

  const removeRole = async (payload) => {
    return await removeRoleRequest(payload, token);
  };

  const deleteUser = async (userId) => {
    return await deleteUserRequest(userId, token);
  };

  const getUserInfo = async () => {
    return await getUserInfoRequest(token);
  };

  const updateUser = async (payload) => {
    return await updateUserRequest(payload, token);
  };

  const changePassword = async (payload) => {
    return await changePasswordRequest(payload, token);
  };

  const value = {
    token,
    user,
    roles: userRoles,
    permissions: userPermissions,
    isAuthenticated: Boolean(token),
    isAuthLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    register,
    getAllUsers,
    searchUsers,
    listRolePermissions,
    resetPassword,
    assignRole,
    removeRole,
    deleteUser,
    getUserInfo,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
