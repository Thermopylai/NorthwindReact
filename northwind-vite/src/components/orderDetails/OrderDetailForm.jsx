import { useState } from "react";

const emptyForm = {
  OrderID: "",
  ProductID: "",
  UnitPrice: "",
  Quantity: "",
  Discount: "",
  IsDeleted: false,
};

const OrderDetailForm = ({
  orderId,
  selectedOrderDetail,
  products,
  onSave,
  onCancel,
  isEditing,
}) => {
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
      .replace(/%/g, "")
      .replace(/€/g, "")
      .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const clampPercent = (value) => {
    return Math.min(1, Math.max(0, value / 100));
  };

  const formatPercent = (value) => {
    if (value == null || !Number.isFinite(value)) {
      return "0,00 %";
    }

    return Number(value).toLocaleString("fi-FI", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
    selectedOrderDetail
      ? {
          OrderID: selectedOrderDetail.orderID,
          ProductID: selectedOrderDetail.productID,
          UnitPrice:
            selectedOrderDetail.unitPrice == null
              ? ""
              : formatCurrency(Number(selectedOrderDetail.unitPrice)),
          Quantity: selectedOrderDetail.quantity ?? "",
          Discount:
            selectedOrderDetail.discount == null
              ? ""
              : formatPercent(
                  clampPercent(Number(selectedOrderDetail.discount) * 100),
                ),
          IsDeleted: selectedOrderDetail.isDeleted ?? false,
        }
      : {
          ...emptyForm,
          OrderID: orderId,
        },
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (!isEditing && name === "ProductID") {
      const selectedProduct = products.find(
        (p) => String(p.productID) === String(value),
      );
      const unitPrice = selectedProduct?.unitPrice ?? "";
      const parsedUnitPrice = toNullableDecimal(unitPrice);

      setFormData((prev) => ({
        ...prev,
        ProductID: value,
        UnitPrice:
          parsedUnitPrice == null ? "" : formatCurrency(parsedUnitPrice),
      }));

      return;
    }

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

  const handleDiscountBlur = () => {
    setFormData((prev) => {
      const parsed = toNullableDecimal(prev.Discount);

      if (prev.Discount === "") {
        return prev;
      }

      if (parsed == null) {
        return prev;
      }

      const clamped = clampPercent(parsed);

      return {
        ...prev,
        Discount: formatPercent(clamped),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const unitPrice = toNullableDecimal(formData.UnitPrice);
    const discountPercent = toNullableDecimal(formData.Discount);
    const safeDiscountPercent = clampPercent(discountPercent ?? 0);

    const payload = {
      OrderID: Number(formData.OrderID),
      ProductID: Number(formData.ProductID),
      UnitPrice: unitPrice,
      Quantity: formData.Quantity === "" ? null : Number(formData.Quantity),
      Discount: formData.Discount === "" ? 0 : safeDiscountPercent,
      IsDeleted: formData.IsDeleted,
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3">
        {isEditing ? (
          <>
            Muokkaa <em>order detail</em> -riviä
          </>
        ) : (
          <>
            Lisää <em>order detail</em> -rivi
          </>
        )}
      </p>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="OrderID">
            Tilaus
          </label>
          <input
            id="OrderID"
            name="OrderID"
            type="number"
            min="0"
            value={formData.OrderID}
            readOnly
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ProductID">
            Tuote
          </label>
          <select
            id="ProductID"
            name="ProductID"
            value={formData.ProductID}
            onChange={handleChange}
            disabled={isEditing}
            required
            className="form-select"
          >
            <option value="">-- Valitse tuote --</option>
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
          <label className="input-group-text" htmlFor="UnitPrice">
            Yksikköhinta (€)
          </label>
          <input
            id="UnitPrice"
            name="UnitPrice"
            type="text"
            inputMode="decimal"
            className="form-control"
            value={formData.UnitPrice}
            onChange={handleChange}
            onBlur={handleUnitPriceBlur}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Quantity">
            Määrä (kpl)
          </label>
          <input
            id="Quantity"
            name="Quantity"
            type="number"
            min="0"
            className="form-control"
            value={formData.Quantity}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Discount">
            Alennus (%)
          </label>
          <input
            id="Discount"
            name="Discount"
            type="text"
            inputMode="decimal"
            className="form-control"
            value={formData.Discount}
            onChange={handleChange}
            onBlur={handleDiscountBlur}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="IsDeleted">
            Poistettu
          </label>
          <div className="input-group-text">
            <input
              id="IsDeleted"
              name="IsDeleted"
              type="checkbox"
              className="form-check-input mt-0"
              checked={formData.IsDeleted}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          style={{ marginBottom: "15px" }}
          type="submit"
          className="btn btn-primary me-1"
        >
          {isEditing ? "Tallenna muutokset" : "Lisää rivi"}
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

export default OrderDetailForm;
