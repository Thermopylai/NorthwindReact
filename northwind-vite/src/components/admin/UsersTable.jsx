import { useState } from "react";

const UsersTable = ({
  users,
  currentUserId,
  onDelete,
  onAssignRole,
  onRemoveRole,
  roleNames,
  onOpenResetPassword,
}) => {
  const [selectedRoles, setSelectedRoles] = useState({});

  if (!users.length) {
    return <p>Ei käyttäjiä näytettäväksi.</p>;
  }

  const handleSelectedRoleChange = (userId, roleName) => {
    setSelectedRoles((current) => ({
      ...current,
      [userId]: roleName,
    }));
  };

  const handleAssignRoleClick = async (userId) => {
    const selectedRole = selectedRoles[userId];

    if (!selectedRole) {
      return;
    }

    await onAssignRole(userId, selectedRole);

    setSelectedRoles((current) => ({
      ...current,
      [userId]: "",
    }));
  };

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <th>Käyttäjänimi</th>
          <th>Sähköposti</th>
          <th>Roolit</th>
          <th>Lisää rooli</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const userId = user.userId ?? user.UserId;
          const userName = user.userName ?? user.UserName;
          const email = user.email ?? user.Email;
          const roles = user.roles ?? user.Roles ?? [];

          const isCurrentUser = userId === currentUserId;

          const availableRoles = roleNames.filter(
            (roleName) => !roles.includes(roleName),
          );

          const selectedRole = selectedRoles[userId] ?? "";

          return (
            <tr key={userId}>
              <td>{userName}</td>
              <td>{email}</td>

              <td>
                {roles.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <span key={role} className="badge text-bg-secondary">
                        {role}

                        {!isCurrentUser && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light ms-2 py-0 px-1"
                            onClick={() => onRemoveRole(userId, role)}
                            title={`Poista rooli ${role}`}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <div className="d-flex flex-wrap gap-2">
                  <select
                    className="form-select form-select-sm"
                    value={selectedRole}
                    onChange={(event) =>
                      handleSelectedRoleChange(userId, event.target.value)
                    }
                    disabled={availableRoles.length === 0}
                  >
                    <option value="">Valitse rooli</option>

                    {availableRoles.map((roleName) => (
                      <option key={roleName} value={roleName}>
                        {roleName}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAssignRoleClick(userId)}
                    disabled={!selectedRole}
                  >
                    Lisää
                  </button>
                </div>
              </td>

              <td className="text-nowrap">
                <button
                  type="button"
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onOpenResetPassword(user)}
                >
                  Resetoi salasana
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(userId)}
                  disabled={isCurrentUser}
                >
                  Poista
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsersTable;
