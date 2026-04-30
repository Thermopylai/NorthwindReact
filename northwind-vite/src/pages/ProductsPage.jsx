import { useEffect, useState } from "react";
import ProductFilters from "../components/products/ProductFilters";
import ProductForm from "../components/products/ProductForm";
import Pagination from "../components/shared/Pagination";
import ProductTable from "../components/products/ProductTable";
import {
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../api/products";
import { getNextSortState } from "../utils/sortHelpers";
import {
  getCategories,
  getSuppliers,
  getCustomers,
  getEmployees,
  getOrders,
  getShippers,
} from "../api/lookups";
import PermissionGate from "../auth/PermissionGate";

const defaultSort = {
  orderBy: "",
  descending: false,
};

const defaultFilters = {
  supplierId: "",
  categoryId: "",
  discontinued: "",
  minPrice: "",
  maxPrice: "",
  vatRate: "",
  searchTerm: "",
  orderBy: defaultSort.orderBy,
  descending: defaultSort.descending,
  page: 1,
  pageSize: 10,
};

const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
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

  const loadLookups = async () => {
    try {
      setLoading(true);
      setError("");
      const [
        categoryData,
        supplierData,
        customerData,
        employeeData,
        orderData,
        shipperData,
      ] = await Promise.all([
        getCategories(),
        getSuppliers(),
        getCustomers(),
        getEmployees(),
        getOrders(),
        getShippers(),
      ]);

      setCategories(categoryData);
      setSuppliers(supplierData);
      setCustomers(customerData);
      setEmployees(employeeData);
      setOrders(orderData);
      setShippers(shipperData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");

      const result = await searchProducts(activeFilters);

      setProducts(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(defaultFilters);
    loadLookups();
  }, []);

  const handleToggleDetails = (productId) => {
    if (selectedProductId === productId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedProductId(productId);
    setShowDetails(true);
  };

  const handleRefreshProducts = async () => {
    await loadLookups();
  };

  const handleSearch = async () => {
    const nextFilters = {
      ...filters,
      page: 1,
    };

    setFilters(nextFilters);
    await loadProducts(nextFilters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadProducts(defaultFilters);
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
    await loadProducts(nextFilters);
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const product = await getProductById(id);
      setSelectedProduct(product);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän tuotteen?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await deleteProduct(id);
      await loadProducts(filters);

      if (selectedProduct?.productID === id) {
        setSelectedProduct(null);
        setSelectedProductId(null);
        setShowDetails(false);
      }

      setSuccessMessage("Tuote poistettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti palauttaa tämän tuotteen?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await restoreProduct(id);
      await loadProducts(filters);

      if (selectedProduct?.productID === id) {
        setSelectedProduct(null);
        setSelectedProductId(null);
        setShowDetails(false);
      }

      setSuccessMessage("Tuote palautettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedProduct) {
        await updateProduct(selectedProduct.productID, payload);
        setSuccessMessage("Tuote päivitettiin onnistuneesti.");
      } else {
        await createProduct(payload);
        setSuccessMessage("Tuote lisättiin onnistuneesti.");
      }

      setSelectedProduct(null);
      setFormResetToken((prev) => prev + 1);
      await loadProducts(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setShowDetails(false);
      setSelectedProductId(null);
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setError("");
    setSuccessMessage("");
    setShowDetails(false);
    setSelectedProductId(null);
  };

  const handleSort = async (columnName) => {
    const nextSort = getNextSortState({
      clickedColumn: columnName,
      currentSortBy: filters.orderBy,
      currentDescending: filters.descending,
      defaultSort,
      descendingFirstColumns: ["ProductID"],
    });

    const nextFilters = {
      ...filters,
      orderBy: nextSort.orderBy,
      descending: nextSort.descending,
      page: 1,
    };

    setFilters(nextFilters);
    await loadProducts(nextFilters);
  };

  return (
    <div>
      <h1 className="text-center mb-3">Tuotteet</h1>

      <div className="row">
        <div className="col-md-6 mb-3">
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            categories={categories}
            suppliers={suppliers}
          />
          <span>
            <strong>Yhteensä:</strong> {totalCount} tuotetta
          </span>
        </div>
        <PermissionGate permission="products.manage">
          <div className="col-md-6 mb-3">
            <ProductForm
              key={
                selectedProduct
                  ? `${selectedProduct.productID}-${formResetToken}`
                  : `new-${formResetToken}`
              }
              selectedProduct={selectedProduct}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={Boolean(selectedProduct)}
              categories={categories}
              suppliers={suppliers}
              customers={customers}
              employees={employees}
              orders={orders}
              shippers={shippers}
            />
          </div>
        </PermissionGate>
      </div>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan tuotteita...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <>
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onSort={handleSort}
            sortBy={filters.orderBy}
            descending={filters.descending}
            defaultSort={defaultSort}
            selectedProductId={selectedProductId}
            showDetails={showDetails}
            onToggleDetails={handleToggleDetails}
            onRefreshProducts={handleRefreshProducts}
            employees={employees}
            customers={customers}
            allOrders={orders}
            shippers={shippers}
          />

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

export default ProductsPage;
