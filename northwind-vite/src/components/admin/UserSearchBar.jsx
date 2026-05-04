const UserSearchBar = ({ filters, onChange, onSearch, onReset }) => {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    onChange({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <h2 className="mb-3">Käyttäjähaku</h2>
      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="userId">
            UserId
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            className="form-control"
            value={filters.userId}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-group-text" htmlFor="userName">
            UserName
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            className="form-control"
            value={filters.userName}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-group-text" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            className="form-control"
            value={filters.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-group-text" htmlFor="role">
            Role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            className="form-control"
            value={filters.role}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-group-text" htmlFor="permission">
            Permission
          </label>
          <input
            id="permission"
            name="permission"
            type="text"
            className="form-control"
            value={filters.permission}
            onChange={handleChange}
          />
        </div>
        <button
          className="me-1 btn btn-primary form-button-align"
          type="submit"
        >
          Hae
        </button>
        <button
          className="me-1 btn btn-secondary form-button-align"
          type="button"
          onClick={onReset}
        >
          Tyhjennä
        </button>
      </div>
    </form>
  );
};

export default UserSearchBar;
