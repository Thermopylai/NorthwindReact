import { useEffect, useMemo, useState } from "react";
import { clearAuthToken, getAuthToken, saveAuthToken } from "./authStorage";
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
  changePasswordRequest
} from "../api/auth";
import { AuthContext } from "./authContextInstance";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAuthToken());
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
    const userData = await getUserInfoRequest(token);
    setUser(userData);
    setClaims(userData.claims);
  };

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await loadIdentity(token);
      } catch {
        clearAuthToken();
        setToken(null);
        setUser(null);
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [token]);

  const login = async (payload) => {
    const result = await loginRequest(payload);

    if (!result.accessToken) {
      throw new Error("Access Token puuttuu vastauksesta");
    }

    saveAuthToken(result.accessToken, result.accessTokenExpiresAt);
    setToken(result.accessToken);
    await loadIdentity(result.accessToken);

    return result;
  };

  const refresh = async () => {
    if (!token) {
      throw new Error("Ei tokenia, jota päivittää");
    }
    const result = await refreshRequest(token);
    if (!result.refreshToken) {
      throw new Error("Refresh Token puuttuu vastauksesta");
    }
    saveAuthToken(result.refreshToken, result.refreshTokenExpiresAt);
    setToken(result.refreshToken);
    await loadIdentity(result.refreshToken);
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch {
      // ei blokata logoutia frontendissä vaikka backend-vastaus epäonnistuisi
    } finally {
      clearAuthToken();
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

  const register = async (payload) => {
    const result = await registerRequest(payload);

    if (!result.accessToken) {
      throw new Error("Access Token puuttuu vastauksesta");
    }

    saveAuthToken(result.accessToken, result.accessTokenExpiresAt);
    setToken(result.accessToken);
    await loadIdentity(result.accessToken);

    return result;
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
  }

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
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
