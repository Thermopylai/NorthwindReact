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
  const { deleteUser, searchUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

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
        setUsers(response.users);
      } catch (error) {
        setError("Käyttäjien haku epäonnistui: " + error.message);
      } finally {
        setLoading(false);
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
      await deleteUser(userId);
      setSuccessMessage("Käyttäjä poistettu onnistuneesti");
      await loadUsers(filters);
    } catch (error) {
      setError("Käyttäjän poistaminen epäonnistui: " + error.message);
    }
  };

  const handleSearch = async () => {
    setFilters(filters);
    await loadUsers(filters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadUsers(defaultFilters);
  };

  if (loading) {
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
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      <UsersTable users={users} onDelete={handleDeleteUser} />
    </>
  );
};

export default AdminUsersPage;
