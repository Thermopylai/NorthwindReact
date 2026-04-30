import { useState } from "react";

const emptyForm = {
  CustomerID: "",
  EmployeeID: "",
  OrderDate: "",
  RequiredDate: "",
  ShippedDate: "",
  ShipVia: "",
  Freight: "",
  ShipName: "",
  ShipAddress: "",
  ShipCity: "",
  ShipRegion: "",
  ShipPostalCode: "",
  ShipCountry: "",
  IsDeleted: false,
};

const OrderForm = ({
  selectedOrder,
  onSave,
  onCancel,
  isEditing,
  customers,
  employees,
  shippers,
  customerId,
  employeeId,
  shipperId
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

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    // Format as ISO date (YYYY-MM-DD) for input fields
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState(() =>
    selectedOrder
      ? {
          CustomerID: selectedOrder.customerID ?? "",
          EmployeeID: selectedOrder.employeeID ?? "",
          OrderDate:
            selectedOrder.orderDate == null
              ? ""
              : formatDate(selectedOrder.orderDate),
          RequiredDate:
            selectedOrder.requiredDate == null
              ? ""
              : formatDate(selectedOrder.requiredDate),
          ShippedDate:
            selectedOrder.shippedDate == null
              ? ""
              : formatDate(selectedOrder.shippedDate),
          ShipVia: selectedOrder.shipVia ?? "",
          Freight:
            selectedOrder.freight == null
              ? ""
              : formatCurrency(Number(selectedOrder.freight)),
          ShipName: selectedOrder.shipName ?? "",
          ShipAddress: selectedOrder.shipAddress ?? "",
          ShipCity: selectedOrder.shipCity ?? "",
          ShipRegion: selectedOrder.shipRegion ?? "",
          ShipPostalCode: selectedOrder.shipPostalCode ?? "",
          ShipCountry: selectedOrder.shipCountry ?? "",
          IsDeleted: selectedOrder.isDeleted ?? false,
        }
      : {
          ...emptyForm,
        },
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "CustomerID") {
      const selectedCustomer = customers.find(
        (c) => String(c.customerID) === String(value),
      );
      const shipName = selectedCustomer?.companyName ?? "";
      const shipAddress = selectedCustomer?.address ?? "";
      const shipCity = selectedCustomer?.city ?? "";
      const shipRegion = selectedCustomer?.region ?? "";
      const shipPostalCode = selectedCustomer?.postalCode ?? "";
      const shipCountry = selectedCustomer?.country ?? "";

      setFormData((prev) => ({
        ...prev,
        CustomerID: value,
        ShipName: shipName,
        ShipAddress: shipAddress,
        ShipCity: shipCity,
        ShipRegion: shipRegion,
        ShipPostalCode: shipPostalCode,
        ShipCountry: shipCountry,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFreightBlur = () => {
    setFormData((prev) => {
      const parsed = toNullableDecimal(prev.Freight);

      if (prev.Freight === "") {
        return prev;
      }

      if (parsed == null) {
        return prev;
      }

      return {
        ...prev,
        Freight: formatCurrency(parsed),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      CustomerID: formData.CustomerID.trim(),
      EmployeeID: toNullableInt(formData.EmployeeID),
      OrderDate: formData.OrderDate.trim(),
      RequiredDate: formData.RequiredDate.trim(),
      ShippedDate: formData.ShippedDate.trim(),
      ShipVia: toNullableInt(formData.ShipVia),
      Freight: toNullableDecimal(formData.Freight),
      ShipName: formData.ShipName.trim() || null,
      ShipAddress: formData.ShipAddress.trim() || null,
      ShipCity: formData.ShipCity.trim() || null,
      ShipRegion: formData.ShipRegion.trim() || null,
      ShipPostalCode: formData.ShipPostalCode.trim() || null,
      ShipCountry: formData.ShipCountry.trim() || null,
      IsDeleted: formData.IsDeleted,
    };

    onSave(payload);
  };

  return (
    <form key={selectedOrder?.orderID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa tilausta" : "Lisää uusi tilaus"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="CustomerID">
            Asiakas
          </label>
          <select
            id="CustomerID"
            name="CustomerID"
            value={customerId ? customerId : formData.CustomerID}
            disabled={customerId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse asiakas --</option>
            {customers
              .sort((a, b) => a.companyName.localeCompare(b.companyName))
              .map((customer) => (
                <option key={customer.customerID} value={customer.customerID}>
                  {customer.companyName ?? customer.customerID}
                </option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="EmployeeID">
            Työntekijä
          </label>
          <select
            id="EmployeeID"
            name="EmployeeID"
            value={employeeId ? employeeId : formData.EmployeeID}
            disabled={employeeId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse työntekijä --</option>
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
          <label className="input-group-text" htmlFor="ShipVia">
            Kuljettaja
          </label>
          <select
            id="ShipVia"
            name="ShipVia"
            value={shipperId ? shipperId : formData.ShipVia}
            disabled={shipperId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse kuljettaja --</option>
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
          <label className="input-group-text" htmlFor="OrderDate">
            Tilauspvm
          </label>
          <input
            id="OrderDate"
            name="OrderDate"
            type="date"
            value={formData.OrderDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="RequiredDate">
            Tarvepvm
          </label>
          <input
            id="RequiredDate"
            name="RequiredDate"
            type="date"
            value={formData.RequiredDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShippedDate">
            Toimituspvm
          </label>
          <input
            id="ShippedDate"
            name="ShippedDate"
            type="date"
            value={formData.ShippedDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShipName">
            Nimi
          </label>
          <input
            id="ShipName"
            name="ShipName"
            type="text"
            value={formData.ShipName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShipAddress">
            Osoite
          </label>
          <input
            id="ShipAddress"
            name="ShipAddress"
            type="text"
            value={formData.ShipAddress}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShipCity">
            Kaupunki
          </label>
          <input
            id="ShipCity"
            name="ShipCity"
            type="text"
            value={formData.ShipCity}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShipPostalCode">
            Postinumero
          </label>
          <input
            id="ShipPostalCode"
            name="ShipPostalCode"
            type="text"
            value={formData.ShipPostalCode}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShipRegion">
            Alue
          </label>
          <input
            id="ShipRegion"
            name="ShipRegion"
            type="text"
            value={formData.ShipRegion}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ShipCountry">
            Maa
          </label>
          <input
            id="ShipCountry"
            name="ShipCountry"
            type="text"
            value={formData.ShipCountry}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Freight">
            Rahti (€)
          </label>
          <input
            id="Freight"
            name="Freight"
            type="text"
            inputMode="decimal"
            className="form-control"
            value={formData.Freight}
            onChange={handleChange}
            onBlur={handleFreightBlur}
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
              checked={formData.IsDeleted}
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
          {isEditing ? "Tallenna muutokset" : "Lisää tilaus"}
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

export default OrderForm;
