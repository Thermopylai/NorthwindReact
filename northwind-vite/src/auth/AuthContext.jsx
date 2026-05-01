import { useEffect, useMemo, useState } from "react";
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
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const permissionClaims = useMemo(() => {
    return claims
      .filter((c) => c.type.toLowerCase().includes("permission"))
      .map((c) => c.value);
  }, [claims]);

  const roleClaims = useMemo(() => {
    return claims
      .filter(
        (c) =>
          c.type === "role" ||
          c.type.endsWith("/role") ||
          c.type.toLowerCase().includes("role"),
      )
      .map((c) => c.value);
  }, [claims]);

  const loadIdentity = async (token) => {
    if (!token) {
      throw new Error("Ei tokenia, identiteettiä ei voi ladata");
    }
    const userData = await getUserInfoRequest(token);
    setUser({ 
      userId: userData.userId,
      userName: userData.userName,
      email: userData.email,
    });
    setClaims(userData.claims);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = getAuthToken();
        const refreshToken = getRefreshToken();
        const accessTokenExpiresAt = getAccessTokenExpiresAt();
        const refreshTokenExpiresAt = getRefreshTokenExpiresAt();

        if (!accessToken || !refreshToken) {
          clearAuthTokens();
          setLoading(false);
          return;
        }

        if (!isDateExpired(accessTokenExpiresAt)) {
          setToken(accessToken);
          await loadIdentity(accessToken);
          return;
        }

        if (isDateExpired(refreshTokenExpiresAt)) {
          clearAuthTokens();
          return;
        }

        if (isDateExpiringSoon(accessTokenExpiresAt, 60)) {
          const refreshed = await refreshRequest();
          saveAuthTokens(refreshed);
          setToken(refreshed.accessToken);
          await loadIdentity(refreshed.accessToken);
          return;
        }
        
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuthTokens();
        setToken(null);
        setUser(null);
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

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

  const refresh = async () => {
    const result = await refreshRequest(token);

    if (!result.success) {
      throw new Error("Virhe päivityksessä: " + result.message);
    }

    saveAuthTokens(result);
    setToken(result.refreshToken);
    await loadIdentity(result.refreshToken);
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch (error) {
      console.warn("Backend logout failed: ", error);
    } finally {
      clearAuthTokens();
      setToken(null);
      setUser(null);
      setClaims([]);
    }
  };

  const hasPermission = (permission) => {
    return permissionClaims.includes(permission);
  };

  const hasRole = (role) => {
    return roleClaims.includes(role);
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
    claims,
    roles: roleClaims,
    permissions: permissionClaims,
    isAuthenticated: Boolean(token),
    loading,
    login,
    refresh,
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
