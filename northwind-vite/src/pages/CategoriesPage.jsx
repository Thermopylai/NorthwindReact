import { useEffect, useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryTable from "../components/categories/CategoryTable";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "../api/categories";
import { getSuppliers } from "../api/lookups";
import PermissionGate from "../auth/PermissionGate";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [formResetToken, setFormResetToken] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setError("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  const loadLookups = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoryData, supplierData] = await Promise.all([
        getCategories(),
        getSuppliers(),
      ]);

      setCategories(categoryData);
      setSuppliers(supplierData);
    } catch (err) {
      setCategories([]);
      setSuppliers([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedCategory(null);
    setSelectedCategoryId(null);
    loadLookups();
  }, []);

  const handleToggleDetails = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedCategoryId(categoryId);
    setShowDetails(true);
  };

  const handleRefreshCategories = async () => {
    await loadLookups();
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const category = await getCategoryById(id);
      setSelectedCategory(category);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän kategorian?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      await deleteCategory(id);
      await loadLookups();

      if (selectedCategory?.categoryID === id) {
        setSelectedCategory(null);
        setSelectedCategoryId(null);
      }

      setSuccessMessage("Kategoria poistettu onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Haluatko varmasti palauttaa tämän kategorian?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      await restoreCategory(id);
      await loadLookups();

      if (selectedCategory?.categoryID === id) {
        setSelectedCategory(null);
        setSelectedCategoryId(null);
      }

      setSuccessMessage("Kategoria palautettu onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedCategory) {
        await updateCategory(selectedCategory.categoryID, payload);
        setSuccessMessage("Kategoria päivitetty onnistuneesti.");
      } else {
        await createCategory(payload);
        setSuccessMessage("Kategoria lisättiin onnistuneesti.");
      }

      await loadLookups();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setFormResetToken((prev) => prev + 1);
      setSelectedCategory(null);
      setSelectedCategoryId(null);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setSelectedCategoryId(null);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div>
      <h1 className="text-center mb-3">Kategoriat</h1>
      <PermissionGate permission="categories.manage">
        <div className="mb-3">
          <CategoryForm
            key={
              selectedCategory
                ? `${selectedCategory.categoryID}-${formResetToken}`
                : `new-${formResetToken}`
            }
            selectedCategory={selectedCategory}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={Boolean(selectedCategory)}
          />
        </div>
      </PermissionGate>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan tuotteita...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          selectedCategoryId={selectedCategoryId}
          showDetails={showDetails}
          onToggleDetails={handleToggleDetails}
          onRefreshCategories={handleRefreshCategories}
          suppliers={suppliers}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
