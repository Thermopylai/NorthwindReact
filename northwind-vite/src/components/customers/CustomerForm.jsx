import { useState } from "react";

const emptyForm = {
  CustomerID: "",
  CompanyName: "",
  ContactName: "",
  ContactTitle: "",
  Address: "",
  City: "",
  Region: "",
  PostalCode: "",
  Country: "",
  Phone: "",
  Fax: "",
  IsDeleted: false,
};

const CustomerForm = ({ selectedCustomer, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(() =>
    selectedCustomer
      ? {
          CustomerID: selectedCustomer.customerID ?? "",
          CompanyName: selectedCustomer.companyName ?? "",
          ContactName: selectedCustomer.contactName ?? "",
          ContactTitle: selectedCustomer.contactTitle ?? "",
          Address: selectedCustomer.address ?? "",
          City: selectedCustomer.city ?? "",
          Region: selectedCustomer.region ?? "",
          PostalCode: selectedCustomer.postalCode ?? "",
          Country: selectedCustomer.country ?? "",
          Phone: selectedCustomer.phone ?? "",
          Fax: selectedCustomer.fax ?? "",
          IsDeleted: selectedCustomer.isDeleted ?? false,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      CustomerID: formData.CustomerID.trim(),
      CompanyName: formData.CompanyName.trim(),
      ContactName: formData.ContactName.trim() || null,
      ContactTitle: formData.ContactTitle.trim() || null,
      Address: formData.Address.trim() || null,
      City: formData.City.trim() || null,
      Region: formData.Region.trim() || null,
      PostalCode: formData.PostalCode.trim() || null,
      Country: formData.Country.trim() || null,
      Phone: formData.Phone.trim() || null,
      Fax: formData.Fax.trim() || null,
      IsDeleted: formData.IsDeleted,
    };

    onSave(payload);
  };

  return (
    <form key={selectedCustomer?.customerID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa asiakasta" : "Lisää uusi asiakas"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="CustomerID">
            Asiakastunnus
          </label>
          <input
            type="text"
            className="form-control"
            id="CustomerID"
            name="CustomerID"
            value={formData.CustomerID}
            onChange={handleChange}
            disabled={isEditing}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="CompanyName">
            Yrityksen nimi
          </label>
          <input
            type="text"
            className="form-control"
            id="CompanyName"
            name="CompanyName"
            value={formData.CompanyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ContactName">
            Yhteyshenkilö
          </label>
          <input
            type="text"
            className="form-control"
            id="ContactName"
            name="ContactName"
            value={formData.ContactName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ContactTitle">
            Yhteyshenkilön titteli
          </label>
          <input
            type="text"
            className="form-control"
            id="ContactTitle"
            name="ContactTitle"
            value={formData.ContactTitle}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Address">
            Osoite
          </label>
          <input
            type="text"
            className="form-control"
            id="Address"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="City">
            Kaupunki
          </label>
          <input
            type="text"
            className="form-control"
            id="City"
            name="City"
            value={formData.City}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Region">
            Alue
          </label>
          <input
            type="text"
            className="form-control"
            id="Region"
            name="Region"
            value={formData.Region}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="PostalCode">
            Postinumero
          </label>
          <input
            type="text"
            className="form-control"
            id="PostalCode"
            name="PostalCode"
            value={formData.PostalCode}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Country">
            Maa
          </label>
          <input
            type="text"
            className="form-control"
            id="Country"
            name="Country"
            value={formData.Country}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Phone">
            Puhelin
          </label>
          <input
            type="text"
            className="form-control"
            id="Phone"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Fax">
            Faksi
          </label>
          <input
            type="text"
            className="form-control"
            id="Fax"
            name="Fax"
            value={formData.Fax}
            onChange={handleChange}
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
          {isEditing ? "Tallenna muutokset" : "Lisää asiakas"}
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

export default CustomerForm;
