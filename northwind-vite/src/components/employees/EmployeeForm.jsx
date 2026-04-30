import { useState } from "react";

const emptyForm = {
  FirstName: "",
  LastName: "",
  Title: "",
  TitleOfCourtesy: "",
  BirthDate: "",
  HireDate: "",
  Address: "",
  City: "",
  Region: "",
  PostalCode: "",
  Country: "",
  HomePhone: "",
  Extension: "",
  Notes: "",
  ReportsTo: "",
  Photo: null,
  PhotoPath: "",
  Territories: [],
  IsDeleted: false,
};

const EmployeeForm = ({
  selectedEmployee,
  onSave,
  onCancel,
  isEditing,
  territories,
  allEmployees,
}) => {
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
    selectedEmployee
      ? {
          EmployeeID: selectedEmployee.employeeID,
          FirstName: selectedEmployee.firstName ?? "",
          LastName: selectedEmployee.lastName ?? "",
          Title: selectedEmployee.title ?? "",
          TitleOfCourtesy: selectedEmployee.titleOfCourtesy ?? "",
          BirthDate: formatDate(selectedEmployee.birthDate),
          HireDate: formatDate(selectedEmployee.hireDate),
          Address: selectedEmployee.address ?? "",
          City: selectedEmployee.city ?? "",
          Region: selectedEmployee.region ?? "",
          PostalCode: selectedEmployee.postalCode ?? "",
          Country: selectedEmployee.country ?? "",
          HomePhone: selectedEmployee.homePhone ?? "",
          Extension: selectedEmployee.extension ?? "",
          Notes: selectedEmployee.notes ?? "",
          ReportsTo: selectedEmployee.reportsTo ?? "",
          Photo: null,
          PhotoPath: selectedEmployee.photoPath ?? "",
          Territories: selectedEmployee.territories
            ? selectedEmployee.territories.map((t) => String(t.territoryID))
            : [],
          IsDeleted: selectedEmployee.isDeleted ?? false,
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

    const payload = new FormData();
    payload.append("LastName", formData.LastName.trim());
    payload.append("FirstName", formData.FirstName.trim());
    payload.append("Title", formData.Title.trim() || null);
    payload.append("TitleOfCourtesy", formData.TitleOfCourtesy.trim() || null);
    payload.append(
      "BirthDate",
      formData.BirthDate ? new Date(formData.BirthDate).toISOString() : "",
    );
    payload.append(
      "HireDate",
      formData.HireDate ? new Date(formData.HireDate).toISOString() : "",
    );
    payload.append("Address", formData.Address.trim() || null);
    payload.append("City", formData.City.trim() || null);
    payload.append("Region", formData.Region.trim() || null);
    payload.append("PostalCode", formData.PostalCode.trim() || null);
    payload.append("Country", formData.Country.trim() || null);
    payload.append("HomePhone", formData.HomePhone.trim() || null);
    payload.append("Extension", formData.Extension.trim() || null);
    payload.append("Notes", formData.Notes.trim() || null);
    payload.append("ReportsTo", formData.ReportsTo || "");
    if (formData.Photo) {
      payload.append("Photo", formData.Photo);
    } else if (formData.PhotoPath) {
      payload.append("PhotoPath", formData.PhotoPath);
    }
    payload.append("IsDeleted", formData.IsDeleted);

    // For multipart/form-data, send arrays as repeated keys so typical backends
    // (e.g. ASP.NET model binding) can bind `Territories` as a list.
    formData.Territories.forEach((territoryId) => {
      payload.append("Territories", String(territoryId));
    });

    onSave(payload);
  };

  return (
    <form key={selectedEmployee?.employeeID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa työntekijää" : "Lisää uusi työntekijä"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="FirstName">
            Etunimi
          </label>
          <input
            type="text"
            className="form-control"
            id="FirstName"
            name="FirstName"
            required
            value={formData.FirstName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="LastName">
            Sukunimi
          </label>
          <input
            type="text"
            className="form-control"
            id="LastName"
            name="LastName"
            required
            value={formData.LastName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Title">
            Titteli
          </label>
          <input
            type="text"
            className="form-control"
            id="Title"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="TitleOfCourtesy">
            Titteli (kohteliaisuus)
          </label>
          <input
            type="text"
            className="form-control"
            id="TitleOfCourtesy"
            name="TitleOfCourtesy"
            value={formData.TitleOfCourtesy}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="BirthDate">
            Syntymäaika
          </label>
          <input
            type="date"
            className="form-control"
            id="BirthDate"
            name="BirthDate"
            value={formData.BirthDate}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="HireDate">
            Palkkauspvm
          </label>
          <input
            type="date"
            className="form-control"
            id="HireDate"
            name="HireDate"
            value={formData.HireDate}
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
          <label className="input-group-text" htmlFor="HomePhone">
            Kotipuhelin
          </label>
          <input
            type="text"
            className="form-control"
            id="HomePhone"
            name="HomePhone"
            value={formData.HomePhone}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Extension">
            Laajennus
          </label>
          <input
            type="text"
            className="form-control"
            id="Extension"
            name="Extension"
            value={formData.Extension}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Notes">
            Muistiinpanot
          </label>
          <textarea
            className="form-control"
            type="text-area"
            id="Notes"
            name="Notes"
            value={formData.Notes}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="ReportsTo">
            Esihenkilö
          </label>
          <select
            id="ReportsTo"
            name="ReportsTo"
            value={formData.ReportsTo}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Ei esihenkilöä --</option>
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
          <label className="input-group-text" htmlFor="Photo">
            Kuva
          </label>
          <input
            type="file"
            className="form-control"
            id="Photo"
            name="Photo"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Photo: e.target.files[0] }))
            }
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="PhotoPath">
            Kuvan polku
          </label>
          <input
            type="url"
            className="form-control"
            id="PhotoPath"
            name="PhotoPath"
            value={formData.PhotoPath}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Territories">
            Territoriot
          </label>
          <select
            id="Territories"
            name="Territories"
            multiple
            value={formData.Territories}
            onChange={(e) => {
              const options = Array.from(e.target.options);
              const selectedValues = options
                .filter((option) => option.selected)
                .map((option) => option.value);
              setFormData((prev) => ({ ...prev, Territories: selectedValues }));
            }}
            className="form-select"
          >
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

        <button
          style={{ marginBottom: "15px" }}
          type="submit"
          className="btn btn-primary me-1"
        >
          {isEditing ? "Tallenna muutokset" : "Lisää työntekijä"}
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

export default EmployeeForm;
