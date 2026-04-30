const ProductFilters = ({
  filters,
  onChange,
  onSearch,
  onReset,
  categories,
  suppliers,
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
          <label className="input-group-text" htmlFor="supplierId">
            Toimittaja
          </label>
          <select
            id="supplierId"
            name="supplierId"
            value={filters.supplierId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki toimittajat</option>
            {suppliers
              .sort((a, b) => a.companyName.localeCompare(b.companyName))
              .map((supplier) => (
                <option key={supplier.supplierID} value={supplier.supplierID}>
                  {supplier.companyName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="categoryId">
            Kategoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki kategoriat</option>
            {categories
              .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
              .map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="vatRate">
            ALV-prosentti
          </label>
          <select
            id="vatRate"
            name="vatRate"
            value={filters.vatRate}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Kaikki verokannat</option>
            <option value="0.135">13.5 %</option>
            <option value="0.24">24 %</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="minPrice">
            Min hinta (€)
          </label>
          <input
            id="minPrice"
            name="minPrice"
            type="text"
            inputMode="decimal"
            value={filters.minPrice}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="maxPrice">
            Max hinta (€)
          </label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="text"
            inputMode="decimal"
            value={filters.maxPrice}
            onChange={handleChange}
            className="form-control"
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
            <option value="ProductID">ID</option>
            <option value="ProductName">Nimi</option>
            <option value="SupplierName">Toimittaja</option>
            <option value="CategoryName">Kategoria</option>
            <option value="UnitPrice">Hinta (€)</option>
            <option value="UnitsInStock">Varastossa (kpl)</option>
            <option value="PriceWithVat">Hinta ALV:n kanssa (€)</option>
            <option value="StockValue">Varaston arvo (€)</option>
            <option value="StockValueWithVat">
              Varaston arvo ALV:n kanssa (€)
            </option>
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
          <label className="input-group-text" htmlFor="discontinued">
            Poistettu
          </label>
          <select
            id="discontinued"
            name="discontinued"
            value={filters.discontinued}
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

export default ProductFilters;
