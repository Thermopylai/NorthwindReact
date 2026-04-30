import { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import {
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../../api/products";
import { getNextSortState } from "../../utils/sortHelpers";
import PermissionGate from "../../auth/PermissionGate";

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

const ProductsPanel = ({
  categoryId = "",
  supplierId = "",
  pageSize, // Lock pageSize to category's product count to show all products without pagination.
  suppliers,
  categories,
  onRefreshCategories,
  onRefreshSuppliers,
}) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formResetToken, setFormResetToken] = useState(0);

  const [filters, setFilters] = useState({
    ...defaultFilters,
    pageSize,
    categoryId,
    supplierId,
  });

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

  const loadProducts = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");

      const data = await searchProducts(activeFilters);

      setProducts(data.items);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(filters);
  }, [filters]);

  const handleToggleDetails = (productId) => {
    if (selectedProductId === productId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedProductId(productId);
    setShowDetails(true);
  };

  const handleRefreshProducts = async () => {
    await loadProducts(filters);
  };

  const preserveScrollToTableRow = async (
    categoryId,
    supplierId,
    asyncAction,
  ) => {
    await asyncAction();
    const rowId =
      categoryId !== ""
        ? `category-row-${categoryId}`
        : `supplier-row-${supplierId}`;
    requestAnimationFrame(() => {
      const row = document.getElementById(rowId);

      if (row) {
        row.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
      }
    });
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
    const confirmed = window.confirm("Haluatko varmasti poistaa tuotteen?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await preserveScrollToTableRow(categoryId, supplierId, async () => {
        await deleteProduct(id);
        setSelectedProduct(null);
        await loadProducts(filters);
        await onRefreshCategories();
        await onRefreshSuppliers();
        setSuccessMessage("Tuote poistettiin onnistuneesti.");
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm("Haluatko varmasti palauttaa tuotteen?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await preserveScrollToTableRow(categoryId, supplierId, async () => {
        await restoreProduct(id);
        setSelectedProduct(null);
        await loadProducts(filters);
        await onRefreshCategories();
        await onRefreshSuppliers();
        setSuccessMessage("Tuote palautettiin onnistuneesti.");
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await preserveScrollToTableRow(categoryId, supplierId, async () => {
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
        await onRefreshCategories?.();
        await onRefreshSuppliers?.();
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setError("");
    setSuccessMessage("");
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
      pageSize: pageSize, // Keep page size when changing sort to avoid resetting to first page with 10 items when category has more products.
    };

    setFilters(nextFilters);
    await loadProducts(nextFilters);
  };

  const uniqueBy = (items, getKey) => [
    ...new Map(items.map((item) => [getKey(item), item])).values(),
  ];

  const customers = uniqueBy(
    products.flatMap((product) => product.customers || []),
    (customer) => customer.customerID,
  );

  const employees = uniqueBy(
    products.flatMap((product) => product.employees || []),
    (employee) => employee.employeeID,
  );

  const shippers = uniqueBy(
    products.flatMap((product) => product.shippers || []),
    (shipper) => shipper.shipperID,
  );

  const allOrders = uniqueBy(
    products.flatMap((product) => product.orders || []),
    (order) => order.orderID,
  );

  return (
    <div className="mb-3">
      <PermissionGate permission="products.manage">
        <div className="mb-3">
          <ProductForm
            key={
              selectedProduct
                ? `${selectedProduct.productID}-${formResetToken}`
                : `${categoryId}-new-${formResetToken}`
            }
            categoryId={categoryId}
            supplierId={supplierId}
            selectedProduct={selectedProduct}
            suppliers={suppliers}
            categories={categories}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={Boolean(selectedProduct)}
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
        <ProductTable
          products={products}
          customers={customers}
          employees={employees}
          shippers={shippers}
          allOrders={allOrders}
          onEdit={handleEdit}
          onToggleDetails={handleToggleDetails}
          selectedProductId={selectedProductId}
          showDetails={showDetails}
          onRefreshProducts={handleRefreshProducts}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onSort={handleSort}
          sortBy={filters.orderBy}
          descending={filters.descending}
          defaultSort={defaultSort}
        />
      )}
      <span className="text-muted">Yhteensä: {products.length} tuotetta</span>
    </div>
  );
};

export default ProductsPanel;
