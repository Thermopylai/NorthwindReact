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

  const clearAuthState = () => {
    clearAuthTokens();
    setToken(null);
    setUser(null);
    setClaims([]);
  };

  const permissionClaims = useMemo(() => {
    return claims
      .filter((c) => c.type?.toLowerCase().includes("permission"))
      .map((c) => c.value);
  }, [claims]);

  const roleClaims = useMemo(() => {
    return claims
      .filter((c) => {
        const type = c.type?.toLowerCase() ?? "";

        return (
          type === "role" || type.endsWith("/role") || type.includes("role")
        );
      })
      .map((c) => c.value);
  }, [claims]);

  const loadIdentity = async (accessToken) => {
    if (!accessToken) {
      throw new Error("Ei tokenia, identiteettiä ei voi ladata.");
    }

    const userData = await getUserInfoRequest(accessToken);

    setUser(userData);
    setClaims(userData.claims ?? []);

    return userData;
  };

  useEffect(() => {
    const init = async () => {
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

        const refreshed = await refreshRequest();
        saveAuthTokens(refreshed);
        setToken(refreshed.accessToken);
        await loadIdentity(refreshed.accessToken);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

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
          const result = await refreshRequest();

          if (!result.success) {
            throw new Error(result.message || "Token refresh failed");
          }

          saveAuthTokens(result);
          setToken(result.accessToken);
          await loadIdentity(result.accessToken);
        } catch (error) {
          console.error("Automatic token refresh failed:", error);
          clearAuthState();
        }
      },
      Math.max(refreshDelayMs, 0),
    );

    return () => clearTimeout(timeoutId);
  }, [token]);

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
    const result = await refreshRequest();

    if (!result.success) {
      throw new Error("Virhe päivityksessä: " + result.message);
    }

    saveAuthTokens(result);
    setToken(result.accessToken);
    await loadIdentity(result.accessToken);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.warn("Backend logout epäonnistui: ", error);
    } finally {
      clearAuthState();
      setLoading(false);
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
