import { useEffect, useState, useCallback } from "react";
import UserSearchBar from "../components/admin/UserSearchBar";
import UsersTable from "../components/admin/UsersTable";
import ResetPasswordModal from "../components/admin/ResetPasswordModal";
import { useAuth } from "../auth/useAuth";

const defaultFilters = {
  userId: "",
  userName: "",
  email: "",
  role: "",
  permission: "",
};

const AdminUsersPage = () => {
  const {
    deleteUser,
    searchUsers,
    user,
    listRolePermissions,
    assignRole,
    removeRole,
    resetPassword,
  } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleNames, setRoleNames] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadRolePermissions = async () => {
      try {
        const response = await listRolePermissions();

        if (!response.success) {
          throw new Error(
            response.message ?? "Roolien ja käyttöoikeuksien haku epäonnistui.",
          );
        }

        const rolePermissions =
          response.rolePermissions ?? response.RolePermissions ?? [];

        setRoleNames(
          rolePermissions
            .map((rp) => rp.roleName ?? rp.RoleName)
            .filter(Boolean),
        );
      } catch (error) {
        setError(
          "Roolien ja käyttöoikeuksien haku epäonnistui: " + error.message,
        );
      }
    };

    loadRolePermissions();
  }, [listRolePermissions]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setError("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    if (!resetPasswordError) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setResetPasswordError("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [resetPasswordError]);

  const loadUsers = useCallback(
    async (activeFilters) => {
      try {
        setLoading(true);
        setError("");
        const response = await searchUsers(activeFilters);

        if (!response.success) {
          throw new Error(response.message ?? "Käyttäjien haku epäonnistui.");
        }

        setUsers(response.users ?? response.Users ?? []);
      } catch (error) {
        setUsers([]);
        setError("Käyttäjien haku epäonnistui: " + error.message);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [searchUsers],
  );

  useEffect(() => {
    loadUsers(defaultFilters);
  }, [loadUsers]);

  const handleAssignRole = async (userId, role) => {
    try {
      setError("");
      setSuccessMessage("");
      const payload = {
        userId,
        roleName: role,
      };
      const response = await assignRole(payload);

      if (!response.success) {
        throw new Error(response.message ?? "Roolin lisääminen epäonnistui.");
      }

      setSuccessMessage("Rooli lisätty onnistuneesti");
      await loadUsers(filters);
    } catch (error) {
      setError("Roolin lisääminen epäonnistui: " + error.message);
    }
  };

  const handleRemoveRole = async (userId, role) => {
    if (
      !window.confirm(
        `Haluatko varmasti poistaa roolin ${role} tältä käyttäjältä?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      const payload = {
        userId,
        roleName: role,
      };
      const response = await removeRole(payload);

      if (!response.success) {
        throw new Error(response.message ?? "Roolin poisto epäonnistui.");
      }

      setSuccessMessage("Rooli poistettu onnistuneesti");
      await loadUsers(filters);
    } catch (error) {
      setError("Roolin poisto epäonnistui: " + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän käyttäjän?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      const response = await deleteUser(userId);

      if (!response.success) {
        throw new Error(response.message ?? "Käyttäjän poisto epäonnistui.");
      }

      setSuccessMessage("Käyttäjä poistettu onnistuneesti");
      await loadUsers(filters);
    } catch (error) {
      setError("Käyttäjän poistaminen epäonnistui: " + error.message);
    }
  };

  const handleSearch = async () => {
    await loadUsers(filters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadUsers(defaultFilters);
  };

  const handleOpenResetPassword = (user) => {
    setResetPasswordUser(user);
    setNewPassword("");
    setResetPasswordError("");
    setError("");
    setSuccessMessage("");
  };

  const handleCloseResetPassword = () => {
    setResetPasswordUser(null);
    setNewPassword("");
    setResetPasswordError("");
    setResetPasswordLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser) {
      return;
    }

    const userId = resetPasswordUser.userId ?? resetPasswordUser.UserId;
    const userName = resetPasswordUser.userName ?? resetPasswordUser.UserName;

    if (!String(newPassword ?? "").trim()) {
      setResetPasswordError("Anna uusi salasana.");
      return;
    }

    try {
      setResetPasswordLoading(true);
      setError("");
      setResetPasswordError("");
      setSuccessMessage("");

      const payload = {
        userId,
        newPassword,
      };

      const response = await resetPassword(payload);

      if (!response.success) {
        throw new Error(
          response.message ?? "Salasanan resetointi epäonnistui.",
        );
      }

      setSuccessMessage(
        `Käyttäjän ${userName} salasana resetoitiin onnistuneesti.`,
      );
      handleCloseResetPassword();
    } catch (error) {
      setResetPasswordError(
        "Salasanan resetointi epäonnistui: " + error.message,
      );
    } finally {
      setResetPasswordLoading(false);
    }
  };

  if (initialLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <UserSearchBar
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div className="mb-3">
        {loading && <p>Ladataan käyttäjiä...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
      </div>

      <UsersTable
        users={users}
        onAssignRole={handleAssignRole}
        onRemoveRole={handleRemoveRole}
        roleNames={roleNames}
        currentUserId={user?.userId ?? user?.UserId}
        onDelete={handleDeleteUser}
        onOpenResetPassword={handleOpenResetPassword}
      />

      <ResetPasswordModal
        user={resetPasswordUser}
        password={newPassword}
        loading={resetPasswordLoading}
        error={resetPasswordError}
        onPasswordChange={setNewPassword}
        onClose={handleCloseResetPassword}
        onConfirm={handleResetPassword}
      />
    </>
  );
};

export default AdminUsersPage;
