const UsersTable = ({ users, onDelete }) => {
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
        {users.map((user) => (
          <tr key={user.userId}>
            <td>{user.userName}</td>
            <td>{user.email}</td>
            <td>{user.roles.join(", ")}</td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(user.userId)}
              >
                Poista
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
