import { useState } from "react";

const emptyForm = {
  TerritoryID: "",
  TerritoryDescription: "",
  RegionID: "",
  IsDeleted: false,
};

const TerritoryForm = ({
  selectedTerritory,
  regionId,
  onSave,
  onCancel,
  isEditing,
}) => {
  const [formData, setFormData] = useState(() =>
    selectedTerritory
      ? {
          TerritoryID: selectedTerritory.territoryID ?? "",
          TerritoryDescription: selectedTerritory.territoryDescription ?? "",
          RegionID: selectedTerritory.regionID ?? "",
          IsDeleted: selectedTerritory.isDeleted ?? false,
        }
      : {
          ...emptyForm,
          RegionID: regionId ?? "",
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
      TerritoryID: formData.TerritoryID.trim(),
      TerritoryDescription: formData.TerritoryDescription.trim(),
      RegionID: formData.RegionID.trim(),
      IsDeleted: formData.IsDeleted,
    };
    onSave(payload);
  };

  return (
    <form key={selectedTerritory?.TerritoryID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa aluetta" : "Lisää uusi alue"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="TerritoryID">
            Alueen tunnus
          </label>
          <input
            type="text"
            className="form-control"
            id="TerritoryID"
            name="TerritoryID"
            value={formData.TerritoryID}
            onChange={handleChange}
            disabled={isEditing}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="TerritoryDescription">
            Alueen kuvaus
          </label>
          <input
            type="text"
            className="form-control"
            id="TerritoryDescription"
            name="TerritoryDescription"
            required
            value={formData.TerritoryDescription}
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
          {isEditing ? "Tallenna muutokset" : "Lisää alue"}
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

export default TerritoryForm;
