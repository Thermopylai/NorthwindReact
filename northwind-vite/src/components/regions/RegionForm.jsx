import { useState } from "react";

const emptyForm = {
  RegionDescription: "",
  IsDeleted: false,
};

const RegionForm = ({ selectedRegion, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(() =>
    selectedRegion
      ? {
          RegionDescription: selectedRegion.regionDescription ?? "",
          IsDeleted: selectedRegion.isDeleted ?? false,
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
      RegionDescription: formData.RegionDescription,
      IsDeleted: formData.IsDeleted,
    };
    onSave(payload);
  };

  return (
    <form key={selectedRegion?.regionID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa aluetta" : "Lisää uusi alue"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="RegionDescription">
            Alueen kuvaus
          </label>
          <input
            type="text"
            className="form-control"
            id="RegionDescription"
            name="RegionDescription"
            required
            value={formData.RegionDescription}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="IsDeleted">
            Poistettu
          </label>
          <div className="input-group-text">
            <input
              type="checkbox"
              className="form-check-input mt-0"
              id="IsDeleted"
              name="IsDeleted"
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
          {isEditing ? "Tallenna" : "Lisää"}
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

export default RegionForm;
