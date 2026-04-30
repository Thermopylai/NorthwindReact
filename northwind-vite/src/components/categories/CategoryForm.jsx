import { useState } from "react";

const emptyForm = {
  CategoryName: "",
  Description: "",
  Picture: null,
  IsDeleted: false,
};

const CategoryForm = ({ selectedCategory, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(() =>
    selectedCategory
      ? {
          CategoryName: selectedCategory.categoryName ?? "",
          Description: selectedCategory.description ?? "",
          Picture: null,
          IsDeleted: selectedCategory.isDeleted ?? false,
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
    payload.append("CategoryName", formData.CategoryName);
    payload.append("Description", formData.Description);

    if (formData.Picture) {
      payload.append("Picture", formData.Picture);
    }
    payload.append("IsDeleted", formData.IsDeleted);

    onSave(payload);
  };

  return (
    <form key={selectedCategory?.categoryID} onSubmit={handleSubmit}>
      <h2 className="mb-3">
        {isEditing ? "Muokkaa kategoriaa" : "Lisää uusi kategoria"}
      </h2>

      <div className="d-flex flex-wrap">
        <div className="input-group">
          <label className="input-group-text" htmlFor="CategoryName">
            Kategorian nimi
          </label>
          <input
            type="text"
            className="form-control"
            id="CategoryName"
            name="CategoryName"
            required
            value={formData.CategoryName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Description">
            Kuvaus
          </label>
          <textarea
            className="form-control"
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-group-text" htmlFor="Picture">
            Kuva
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="Picture"
            name="Picture"
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                Picture: event.target.files?.[0] ?? null,
              }))
            }
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

export default CategoryForm;
