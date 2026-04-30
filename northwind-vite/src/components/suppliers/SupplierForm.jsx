import { useState } from "react";

const emptyForm = {
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
  HomePage: "",
  IsDeleted: false,
};

const SupplierForm = ({ selectedSupplier, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(() =>
    selectedSupplier
      ? {
          CompanyName: selectedSupplier.companyName ?? "",
          ContactName: selectedSupplier.contactName ?? "",
          ContactTitle: selectedSupplier.contactTitle ?? "",
          Address: selectedSupplier.address ?? "",
          City: selectedSupplier.city ?? "",
          Region: selectedSupplier.region ?? "",
          PostalCode: selectedSupplier.postalCode ?? "",
          Country: selectedSupplier.country ?? "",
          Phone: selectedSupplier.phone ?? "",
          Fax: selectedSupplier.fax ?? "",
          HomePage: selectedSupplier.homePage ?? "",
          IsDeleted: selectedSupplier.isDeleted ?? false,
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
      HomePage: formData.HomePage.trim() || null,
      IsDeleted: formData.IsDeleted,
    };

    onSave(payload);
  };

  return (
    <form key={selectedSupplier?.supplierID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa toimittajaa" : "Lisää uusi toimittaja"}
      </h2>

      <div className="d-flex flex-wrap">
        
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
            maxLength={40}
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
            maxLength={30}
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
            maxLength={30}
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
            maxLength={60}
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
            maxLength={15}
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
            maxLength={15}
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
            maxLength={10}
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
            maxLength={15}
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
            maxLength={24}
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
            maxLength={24}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="HomePage">
            Kotisivu
          </label>
          <input
            type="text"
            className="form-control"
            id="HomePage"
            name="HomePage"
            value={formData.HomePage}
            onChange={handleChange}
            maxLength={60}
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
          {isEditing ? "Tallenna muutokset" : "Lisää toimittaja"}
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

export default SupplierForm;
