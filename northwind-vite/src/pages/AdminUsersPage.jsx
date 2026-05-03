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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { deleteUser, searchUsers } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);

  const loadUsers = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      const response = await searchUsers(activeFilters);
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchUsers]);

  useEffect(() => {
    loadUsers(defaultFilters);
  }, [loadUsers]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän käyttäjän?")) {
      return;
    }
    try {
      await deleteUser(userId);
      await loadUsers(filters);
    } catch (error) {
      console.error("Error deleting user:", error);
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
      <UsersTable users={users} onDelete={handleDeleteUser} />
    </>
  );
};

export default AdminUsersPage;
