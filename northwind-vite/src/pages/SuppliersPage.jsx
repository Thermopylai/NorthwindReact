import { useEffect, useState } from "react";
import SupplierTable from "../components/suppliers/SupplierTable";
import SupplierForm from "../components/suppliers/SupplierForm";
import SupplierFilters from "../components/suppliers/SupplierFilters";
import Pagination from "../components/shared/Pagination";
import {
  searchSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
} from "../api/suppliers";
import { getNextSortState } from "../utils/sortHelpers";
import { getSuppliers, getCategories } from "../api/lookups";
import PermissionGate from "../auth/PermissionGate";

const defaultSort = {
  orderBy: "",
  descending: false,
};

const defaultFilters = {
  country: "",
  city: "",
  isDeleted: "",
  searchTerm: "",
  orderBy: defaultSort.orderBy,
  descending: defaultSort.descending,
  page: 1,
  pageSize: 10,
};

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formResetToken, setFormResetToken] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);

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

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadSuppliers = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");

      const result = await searchSuppliers(activeFilters);

      setSuppliers(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message);
      setSuppliers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const loadLookups = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoryData, supplierData] = await Promise.all([
        getCategories(),
        getSuppliers(),
      ]);

      setAllSuppliers(supplierData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers(defaultFilters);
    setSelectedSupplier(null);
    setSelectedSupplierId(null);
    setShowDetails(false);
    loadLookups();
  }, []);

  const handleSearch = async () => {
    const nextFilters = {
      ...filters,
      page: 1,
    };

    setFilters(nextFilters);
    await loadSuppliers(nextFilters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadSuppliers(defaultFilters);
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    const nextFilters = {
      ...filters,
      page: newPage,
    };

    setFilters(nextFilters);
    await loadSuppliers(nextFilters);
  };

  const handleToggleDetails = (supplierId) => {
    if (selectedSupplierId === supplierId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedSupplierId(supplierId);
    setShowDetails(true);
  };

  const handleRefreshSuppliers = async () => {
    await loadLookups();
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const supplier = await getSupplierById(id);
      setSelectedSupplier(supplier);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän toimittajan?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await deleteSupplier(id);
      await loadSuppliers(filters);

      if (selectedSupplier?.supplierID === id) {
        setSelectedSupplier(null);
      }

      setSuccessMessage("Toimittaja poistettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti palauttaa tämän toimittajan?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await restoreSupplier(id);
      await loadSuppliers(filters);

      if (selectedSupplier?.supplierID === id) {
        setSelectedSupplier(null);
      }

      setSuccessMessage("Toimittaja palautettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.supplierID, payload);
        setSuccessMessage("Toimittaja päivitettiin onnistuneesti.");
      } else {
        await createSupplier(payload);
        setSuccessMessage("Toimittaja lisättiin onnistuneesti.");
      }

      setSelectedSupplier(null);
      setFormResetToken((prev) => prev + 1);
      await loadSuppliers(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedSupplier(null);
    setError("");
    setSuccessMessage("");
  };

  const handleSort = async (columnName) => {
    const nextSort = getNextSortState({
      clickedColumn: columnName,
      currentSortBy: filters.orderBy,
      currentDescending: filters.descending,
      defaultSort,
      descendingFirstColumns: ["SupplierID"],
    });

    const nextFilters = {
      ...filters,
      orderBy: nextSort.orderBy,
      descending: nextSort.descending,
      page: 1,
    };

    setFilters(nextFilters);
    await loadSuppliers(nextFilters);
  };

  return (
    <div>
      <h1 className="text-center mb-3">Toimittajat</h1>

      <div className="row">
        <div className="col-md-6 mb-3">
          <SupplierFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            allSuppliers={allSuppliers}
          />
          <span>
            <strong>Yhteensä:</strong> {totalCount} toimittajaa
          </span>
        </div>
        <PermissionGate permission="suppliers.manage">
          <div className="col-md-6 mb-3">
            <SupplierForm
              key={
                selectedSupplier
                  ? `${selectedSupplier.supplierID}-${formResetToken}`
                  : `new-${formResetToken}`
              }
              selectedSupplier={selectedSupplier}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={Boolean(selectedSupplier)}
            />
          </div>
        </PermissionGate>
      </div>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan toimittajia...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <>
          <SupplierTable
            suppliers={suppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onSort={handleSort}
            sortBy={filters.orderBy}
            descending={filters.descending}
            defaultSort={defaultSort}
            onToggleDetails={handleToggleDetails}
            selectedSupplierId={selectedSupplierId}
            showDetails={showDetails}
            onRefreshSuppliers={handleRefreshSuppliers}
            categories={categories}
          />
          <Pagination />
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default SuppliersPage;
