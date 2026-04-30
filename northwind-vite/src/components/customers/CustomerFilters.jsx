const CustomerFilters = ({
  filters,
  onChange,
  onSearch,
  onReset,
  allCustomers,
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
          <label className="input-group-text" htmlFor="country">
            Maa
          </label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki maat</option>
            {allCustomers
              .map((c) => c.country)
              .sort((a, b) => a.localeCompare(b))
              .filter(
                (value, index, self) => value && self.indexOf(value) === index,
              )
              .map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="city">
            Kaupunki
          </label>
          <select
            id="city"
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki kaupungit</option>
            {allCustomers
              .map((c) => c.city)
              .sort((a, b) => a.localeCompare(b))
              .filter(
                (value, index, self) => value && self.indexOf(value) === index,
              )
              .map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
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
            <option value="CustomerID">ID</option>
            <option value="CompanyName">Yrityksen nimi</option>
            <option value="ContactName">Yhteyshenkilö</option>
            <option value="City">Kaupunki</option>
            <option value="Country">Maa</option>
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
          <label className="input-group-text" htmlFor="pageSize">
            Rivejä per sivu
          </label>
          <select
            id="pageSize"
            name="pageSize"
            value={filters.pageSize}
            onChange={handleChange}
            className="form-select"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="searchTerm">
            Hakusana
          </label>
          <input
            id="searchTerm"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            type="text"
            className="form-control"
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

export default CustomerFilters;
