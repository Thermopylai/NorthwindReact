const UsersTable = ({ users, currentUserId, onDelete }) => {
  if (!users.length) {
    return <p>Ei käyttäjiä näytettäväksi.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <th>Käyttäjänimi</th>
          <th>Sähköposti</th>
          <th>Roolit</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const roles = user.roles ?? user.Roles ?? [];
          const isCurrentUser = (user.userId ?? user.UserId) === currentUserId;
          return (
            <tr key={user.userId ?? user.UserId}>
              <td>{user.userName ?? user.UserName}</td>
              <td>{user.email ?? user.Email}</td>
              <td>{roles.length > 0 ? roles.join(", ") : "-"}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(user.userId ?? user.UserId)}
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
