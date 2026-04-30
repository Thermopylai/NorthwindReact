import { useState } from "react";

const emptyForm = {
  CompanyName: "",
  Phone: "",
  RegionID: "",
  IsDeleted: false,
};

const ShipperForm = ({
  selectedShipper,
  onSave,
  onCancel,
  isEditing,
  regions,
}) => {
  const [formData, setFormData] = useState(() =>
    selectedShipper
      ? {
          CompanyName: selectedShipper.companyName ?? "",
          Phone: selectedShipper.phone ?? "",
          RegionID: selectedShipper.regionID ?? "",
          IsDeleted: selectedShipper.isDeleted ?? false,
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
      Phone: formData.Phone.trim() || null,
      RegionID: formData.RegionID || null,
      IsDeleted: formData.IsDeleted,
    };

    onSave(payload);
  };

  return (
    <form key={selectedShipper?.shipperID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa kuljettajaa" : "Lisää uusi kuljettaja"}
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
          <label className="input-group-text" htmlFor="RegionID">
            Alue
          </label>
          <select
            id="RegionID"
            name="RegionID"
            value={formData.RegionID}
            disabled={isEditing}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">-- Valitse alue --</option>
            {regions
              .sort((a, b) =>
                a.regionDescription.localeCompare(b.regionDescription),
              )
              .map((region) => (
                <option key={region.regionID} value={region.regionID}>
                  {region.regionDescription}
                </option>
              ))}
          </select>
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
          {isEditing ? "Tallenna muutokset" : "Lisää kuljettaja"}
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

export default ShipperForm;
