const EmployeeFilters = ({
  filters,
  onChange,
  onSearch,
  onReset,
  territories,
  allEmployees,
}) => {
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
    <form onSubmit={handleSubmit}>
      <h2 className="mb-3">Haku ja suodatus</h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="reportsTo">
            Esihenkilö
          </label>
          <select
            id="reportsTo"
            name="reportsTo"
            value={filters.reportsTo}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse esihenkilö --</option>
            {allEmployees
              .sort((a, b) => a.firstName.localeCompare(b.firstName))
              .map((emp) => (
                <option key={emp.employeeID} value={emp.employeeID}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="territory">
            Territorio
          </label>
          <select
            id="territory"
            name="territory"
            value={filters.territory}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse territorio --</option>
            {territories
              .sort((a, b) =>
                a.territoryDescription.localeCompare(b.territoryDescription),
              )
              .map((territory) => (
                <option
                  key={territory.territoryID}
                  value={territory.territoryID}
                >
                  {territory.territoryID}: {territory.territoryDescription}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="start">
            Palkkauspvm alku
          </label>
          <input
            type="date"
            className="form-control"
            id="start"
            name="start"
            value={filters.start}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label className="input-group-text" htmlFor="end">
            Palkkauspvm loppu
          </label>
          <input
            type="date"
            className="form-control"
            id="end"
            name="end"
            value={filters.end}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="orderBy">
            Järjestä
          </label>
          <select
            id="orderBy"
            name="orderBy"
            value={filters.orderBy}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Oletus (ID) --</option>
            <option value="EmployeeID">ID</option>
            <option value="FirstName">Etunimi</option>
            <option value="LastName">Sukunimi</option>
            <option value="Title">Titteli</option>
            <option value="BirthDate">Syntymäaika</option>
            <option value="HireDate">Palkkauspvm</option>
            <option value="HomePhone">Kotipuhelin</option>
            <option value="ReportsToFullName">Esihenkilön nimi</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="descending">
            Laskeva
          </label>
          <div className="input-group-text">
            <input
              id="descending"
              name="descending"
              type="checkbox"
              checked={filters.descending}
              onChange={handleChange}
              className="form-check-input mt-0"
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="search">
            Hakusana
          </label>
          <input
            type="text"
            className="form-control"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="isDeleted">
            Poistettu
          </label>
          <select
            id="isDeleted"
            name="isDeleted"
            value={filters.isDeleted}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki</option>
            <option value="true">Kyllä</option>
            <option value="false">Ei</option>
          </select>
        </div>

        <button
          style={{ marginBottom: "15px" }}
          className="me-1 btn btn-primary"
          type="submit"
        >
          Hae
        </button>
        <button
          style={{ marginBottom: "15px" }}
          className="me-1 btn btn-secondary"
          type="button"
          onClick={onReset}
        >
          Tyhjennä
        </button>
      </div>
    </form>
  );
};

export default EmployeeFilters;
