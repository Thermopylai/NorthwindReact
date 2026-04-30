import { useEffect, useState } from "react";
import OrderFilters from "../components/orders/OrderFilters";
import OrderForm from "../components/orders/OrderForm";
import Pagination from "../components/shared/Pagination";
import OrderTable from "../components/orders/OrderTable";
import {
  searchOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  restoreOrder,
} from "../api/orders";
import {
  getNextSortState,
} from "../utils/sortHelpers";
import {
  getCustomers,
  getEmployees,
  getShippers,
  getProducts,
  getOrders,
} from "../api/lookups";
import PermissionGate from "../auth/PermissionGate";

const defaultSort = {
  orderBy: "",
  descending: false,
};

const defaultFilters = {
  employeeId: "",
  customerId: "",
  productId: "",
  shipCountry: "",
  shipCity: "",
  start: "",
  end: "",
  minFreight: "",
  maxFreight: "",
  minTotal: "",
  maxTotal: "",
  shipVia: "",
  isDeleted: "",
  searchTerm: "",
  orderBy: defaultSort.orderBy,
  descending: defaultSort.descending,
  page: 1,
  pageSize: 10,
};

const OrdersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [formResetToken, setFormResetToken] = useState(0);

  const [filters, setFilters] = useState(defaultFilters);
  const [showDetails, setShowDetails] = useState(false);

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
      const [customerData, employeeData, shipperData, productData, orderData] =
        await Promise.all([
          getCustomers(),
          getEmployees(),
          getShippers(),
          getProducts(),
          getOrders(),
        ]);

      setCustomers(customerData);
      setEmployees(employeeData);
      setShippers(shipperData);
      setProducts(productData);
      setAllOrders(orderData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");

      const result = await searchOrders(activeFilters);

      setOrders(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message);
      setOrders([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(defaultFilters);
    loadLookups();
  }, []);

  const handleToggleDetails = (orderId) => {
    if (selectedOrderId === orderId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedOrderId(orderId);
    setShowDetails(true);
  };

  const handleRefreshOrders = async () => {
    await loadOrders(filters);
  };

  const handleSearch = async () => {
    const nextFilters = {
      ...filters,
      page: 1,
    };

    setFilters(nextFilters);
    await loadOrders(nextFilters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadOrders(defaultFilters);
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
    await loadOrders(nextFilters);
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const order = await getOrderById(id);
      setSelectedOrder(order);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän tilauksen?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await deleteOrder(id);
      await loadOrders(filters);

      if (selectedOrder?.orderID === id) {
        setSelectedOrder(null);
        setSelectedOrderId(null);
      }

      setSuccessMessage("Tilaus poistettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti palauttaa tämän tilauksen?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await restoreOrder(id);
      await loadOrders(filters);

      if (selectedOrder?.orderID === id) {
        setSelectedOrder(null);
        setSelectedOrderId(null);
      }

      setSuccessMessage("Tilaus palautettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedOrder) {
        await updateOrder(selectedOrder.orderID, payload);
        setSuccessMessage("Tilaus päivitettiin onnistuneesti.");
      } else {
        await createOrder(payload);
        setSuccessMessage("Tilaus lisättiin onnistuneesti.");
      }

      setSelectedOrder(null);
      setSelectedOrderId(null);
      setFormResetToken((prev) => prev + 1);
      await loadOrders(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedOrder(null);
    setSelectedOrderId(null);
    setError("");
    setSuccessMessage("");
  };

  const handleSort = async (columnName) => {
    const nextSort = getNextSortState({
      clickedColumn: columnName,
      currentSortBy: filters.orderBy,
      currentDescending: filters.descending,
      defaultSort,
      descendingFirstColumns: ["OrderID"],
    });

    const nextFilters = {
      ...filters,
      orderBy: nextSort.orderBy,
      descending: nextSort.descending,
      page: 1,
    };

    setFilters(nextFilters);
    await loadOrders(nextFilters);
  };

  return (
    <div>
      <h1 className="text-center mb-3">Tilaukset</h1>

      <div className="row">
        <div className="col-md-6 mb-3">
          <OrderFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            customers={customers}
            employees={employees}
            shippers={shippers}
            products={products}
            allOrders={allOrders}
          />
          <span>
            <strong>Yhteensä:</strong> {totalCount} tilausta
          </span>
        </div>
        <PermissionGate permission="orders.manage">
          <div className="col-md-6 mb-3">
            <OrderForm
              key={
                selectedOrder
                  ? `${selectedOrder.orderID}-${formResetToken}`
                  : `new-${formResetToken}`
              }
              selectedOrder={selectedOrder}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={Boolean(selectedOrder)}
              customers={customers}
              employees={employees}
              shippers={shippers}
            />
          </div>
        </PermissionGate>
      </div>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan tilauksia...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <>
          <OrderTable
            orders={orders}
            selectedOrderId={selectedOrderId}
            showDetails={showDetails}
            onToggleDetails={handleToggleDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onSort={handleSort}
            sortBy={filters.orderBy}
            descending={filters.descending}
            defaultSort={defaultSort}
            products={products}
            onRefreshOrders={handleRefreshOrders}
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

export default OrdersPage;
