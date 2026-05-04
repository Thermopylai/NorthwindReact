import { useEffect, useState, useCallback } from "react";
import UserSearchBar from "../components/admin/UserSearchBar";
import UsersTable from "../components/admin/UsersTable";
import { useAuth } from "../auth/useAuth";

const defaultFilters = {
  userId: "",
  userName: "",
  email: "",
  role: "",
  permission: "",
};

const AdminUsersPage = () => {
  const { deleteUser, searchUsers, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        currentUserId={user?.userId ?? user?.UserId}
        onDelete={handleDeleteUser}
      />
    </>
  );
};

export default AdminUsersPage;
