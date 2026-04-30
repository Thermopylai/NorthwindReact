import { useState } from "react";

const emptyForm = {
  ProductName: "",
  SupplierID: "",
  CategoryID: "",
  QuantityPerUnit: "",
  UnitPrice: "",
  UnitsInStock: "",
  UnitsOnOrder: "",
  ReorderLevel: "",
  Discontinued: false,
  ImageLink: "",
};

const ProductForm = ({
  selectedProduct,
  categoryId,
  supplierId,
  onSave,
  onCancel,
  isEditing,
  suppliers,
  categories,
}) => {
  const toNullableInt = (value) => {
    return value === "" ? null : Number(value);
  };

  const toNullableDecimal = (value) => {
    if (value === "" || value == null) {
      return null;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }

    const normalized = String(value)
      .trim()
      .replace(/\s+/g, "")
      .replace(/€/g, "")
      .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const formatCurrency = (value) => {
    if (value == null || !Number.isFinite(value)) {
      return "0,00 €";
    }

    return Number(value).toLocaleString("fi-FI", {
      style: "currency",
      currency: "EUR",
    });
  };

  const [formData, setFormData] = useState(() =>
    selectedProduct
      ? {
          ProductName: selectedProduct.productName ?? "",
          SupplierID: selectedProduct.supplierID ?? "",
          CategoryID: selectedProduct.categoryID ?? "",
          QuantityPerUnit: selectedProduct.quantityPerUnit ?? "",
          UnitPrice:
            selectedProduct.unitPrice == null
              ? ""
              : formatCurrency(Number(selectedProduct.unitPrice)),
          UnitsInStock: selectedProduct.unitsInStock ?? "",
          UnitsOnOrder: selectedProduct.unitsOnOrder ?? "",
          ReorderLevel: selectedProduct.reorderLevel ?? "",
          Discontinued: selectedProduct.discontinued ?? false,
          ImageLink: selectedProduct.imageLink ?? "",
        }
      : {
          ...emptyForm,
        },
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUnitPriceBlur = () => {
    setFormData((prev) => {
      const parsed = toNullableDecimal(prev.UnitPrice);

      if (prev.UnitPrice === "") {
        return prev;
      }

      if (parsed == null) {
        return prev;
      }

      return {
        ...prev,
        UnitPrice: formatCurrency(parsed),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ProductName: formData.ProductName.trim(),
      SupplierID: toNullableInt(formData.SupplierID),
      CategoryID: toNullableInt(formData.CategoryID),
      QuantityPerUnit: formData.QuantityPerUnit.trim() || null,
      UnitPrice: toNullableDecimal(formData.UnitPrice),
      UnitsInStock: toNullableInt(formData.UnitsInStock),
      UnitsOnOrder: toNullableInt(formData.UnitsOnOrder),
      ReorderLevel: toNullableInt(formData.ReorderLevel),
      Discontinued: formData.Discontinued,
      ImageLink: formData.ImageLink.trim() || null,
    };

    onSave(payload);
  };

  return (
    <form key={selectedProduct?.productID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa tuotetta" : "Lisää uusi tuote"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="ProductName">
            Tuotteen nimi
          </label>
          <input
            id="ProductName"
            name="ProductName"
            type="text"
            value={formData.ProductName}
            onChange={handleChange}
            required
            maxLength={40}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="SupplierID">
            Toimittaja
          </label>
          <select
            id="SupplierID"
            name="SupplierID"
            value={supplierId ? supplierId : formData.SupplierID}
            disabled={isEditing || supplierId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse toimittaja --</option>
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
          <label className="input-group-text" htmlFor="CategoryID">
            Kategoria
          </label>
          <select
            id="CategoryID"
            name="CategoryID"
            value={categoryId ? categoryId : formData.CategoryID}
            onChange={handleChange}
            disabled={isEditing || categoryId}
            required
            className="form-select"
          >
            <option value="">-- Valitse kategoria --</option>
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
          <label className="input-group-text" htmlFor="QuantityPerUnit">
            Määrä per yksikkö
          </label>
          <input
            id="QuantityPerUnit"
            name="QuantityPerUnit"
            type="text"
            value={formData.QuantityPerUnit}
            onChange={handleChange}
            className="form-control"
            maxLength={20}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="UnitPrice">
            Hinta (€)
          </label>
          <input
            id="UnitPrice"
            name="UnitPrice"
            type="text"
            inputMode="decimal"
            value={formData.UnitPrice}
            onChange={handleChange}
            onBlur={handleUnitPriceBlur}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="UnitsInStock">
            Varastossa (kpl)
          </label>
          <input
            id="UnitsInStock"
            name="UnitsInStock"
            type="number"
            min="0"
            value={formData.UnitsInStock}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="UnitsOnOrder">
            Tilauksessa (kpl)
          </label>
          <input
            id="UnitsOnOrder"
            name="UnitsOnOrder"
            type="number"
            min="0"
            value={formData.UnitsOnOrder}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ReorderLevel">
            Uudelleentilaustaso (kpl)
          </label>
          <input
            id="ReorderLevel"
            name="ReorderLevel"
            type="number"
            min="0"
            value={formData.ReorderLevel}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ImageLink">
            Kuvan linkki
          </label>
          <input
            id="ImageLink"
            name="ImageLink"
            type="url"
            value={formData.ImageLink}
            onChange={handleChange}
            maxLength={100}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Discontinued">
            Poistettu
          </label>
          <div className="input-group-text">
            <input
              id="Discontinued"
              name="Discontinued"
              type="checkbox"
              checked={formData.Discontinued}
              onChange={handleChange}
              className="form-check-input mt-0"
            />
          </div>
        </div>

        <button
          style={{ marginBottom: "15px" }}
          type="submit"
          className="btn btn-primary me-1"
        >
          {isEditing ? "Tallenna muutokset" : "Lisää tuote"}
        </button>

        {isEditing && (
          <button
            style={{ marginBottom: "15px" }}
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Peruuta
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
