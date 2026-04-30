const OrderFilters = ({
  filters,
  onChange,
  onSearch,
  onReset,
  customers,
  employees,
  shippers,
  products,
  allOrders,
  customerId,
  employeeId,
  shipperId,
  productId,
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
          <label className="input-group-text" htmlFor="customerId">
            Asiakas
          </label>
          <select
            id="customerId"
            name="customerId"
            value={customerId ? customerId : filters.customerId}
            disabled={customerId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki asiakkaat</option>
            {customers
              .sort((a, b) => a.companyName.localeCompare(b.companyName))
              .map((customer) => (
                <option key={customer.customerID} value={customer.customerID}>
                  {customer.companyName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="employeeId">
            Työntekijä
          </label>
          <select
            id="employeeId"
            name="employeeId"
            value={employeeId ? employeeId : filters.employeeId}
            disabled={employeeId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki työntekijät</option>
            {employees
              .sort((a, b) => a.lastName.localeCompare(b.lastName))
              .map((employee) => (
                <option key={employee.employeeID} value={employee.employeeID}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="shipVia">
            Kuljettaja
          </label>
          <select
            id="shipVia"
            name="shipVia"
            value={shipperId ? shipperId : filters.shipVia}
            disabled={shipperId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki kuljettajat</option>
            {shippers
              .sort((a, b) => a.companyName.localeCompare(b.companyName))
              .map((shipper) => (
                <option key={shipper.shipperID} value={shipper.shipperID}>
                  {shipper.companyName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="productId">
            Tuote
          </label>
          <select
            id="productId"
            name="productId"
            value={productId ? productId : filters.productId}
            disabled={productId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki tuotteet</option>
            {products
              .sort((a, b) => a.productName.localeCompare(b.productName))
              .map((product) => (
                <option key={product.productID} value={product.productID}>
                  {product.productName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="shipCountry">
            Laivausmaa
          </label>
          <select
            id="shipCountry"
            name="shipCountry"
            value={filters.shipCountry}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki maat</option>
            {allOrders
              .map((o) => o.shipCountry)
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
          <label className="input-group-text" htmlFor="shipCity">
            Laivauskaupunki
          </label>
          <select
            id="shipCity"
            name="shipCity"
            value={filters.shipCity}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki kaupungit</option>
            {allOrders
              .map((o) => o.shipCity)
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
          <label className="input-group-text" htmlFor="minFreight">
            Min rahti (€)
          </label>
          <input
            id="minFreight"
            name="minFreight"
            type="text"
            inputMode="decimal"
            value={filters.minFreight}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="maxFreight">
            Max rahti (€)
          </label>
          <input
            id="maxFreight"
            name="maxFreight"
            type="text"
            inputMode="decimal"
            value={filters.maxFreight}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="minTotal">
            Min yhteensä (€)
          </label>
          <input
            id="minTotal"
            name="minTotal"
            type="text"
            inputMode="decimal"
            value={filters.minTotal}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="maxTotal">
            Max yhteensä (€)
          </label>
          <input
            id="maxTotal"
            name="maxTotal"
            type="text"
            inputMode="decimal"
            value={filters.maxTotal}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="start">
            Tilauspvm alku
          </label>
          <input
            id="start"
            name="start"
            type="date"
            className="form-control"
            value={filters.start}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="end">
            Tilauspvm loppu
          </label>
          <input
            id="end"
            name="end"
            type="date"
            className="form-control"
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
            <option value="">-- Oletus (Tilaus) --</option>
            <option value="OrderID">Tilaus</option>
            <option value="CustomerCompanyName">Asiakas</option>
            <option value="EmployeeFullName">Työntekijä</option>
            <option value="OrderDate">Tilauspäivä</option>
            <option value="ShipViaCompanyName">Kuljettaja</option>
            <option value="ShipCountry">Maa</option>
            <option value="TotalAmount">Yhteensä (€)</option>
            <option value="TotalVatAmount">ALV (€)</option>
            <option value="Freight">Rahti (€)</option>
            <option value="FinalAmount">Lopullinen (€)</option>
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
              className="form-check-input mt-0"
              checked={filters.descending}
              onChange={handleChange}
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
          className="btn btn-secondary"
          type="button"
          onClick={onReset}
        >
          Tyhjennä
        </button>
      </div>
    </form>
  );
};

export default OrderFilters;
