import { useEffect, useState } from "react";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerFilters from "../components/customers/CustomerFilters";
import Pagination from "../components/shared/Pagination";
import {
  searchCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
} from "../api/customers";
import { getNextSortState } from "../utils/sortHelpers";
import {
  getCustomers,
  getEmployees,
  getProducts,
  getOrders,
  getShippers,
} from "../api/lookups";
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

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shippers, setShippers] = useState([]);
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

  const loadCustomers = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");

      const result = await searchCustomers(activeFilters);

      setCustomers(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message);
      setCustomers([]);
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

      const [customerData, employeeData, productData, orderData, shipperData] =
        await Promise.all([
          getCustomers(),
          getEmployees(),
          getProducts(),
          getOrders(),
          getShippers(),
        ]);
      setEmployees(employeeData);
      setProducts(productData);
      setOrders(orderData);
      setShippers(shipperData);
      setAllCustomers(customerData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(defaultFilters);
    loadLookups();
  }, []);

  const handleToggleDetails = (customerId) => {
    if (selectedCustomerId === customerId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedCustomerId(customerId);
    setShowDetails(true);
  };

  const handleRefreshCustomers = async () => {
    await loadLookups();
  };

  const handleSearch = async () => {
    const nextFilters = {
      ...filters,
      page: 1,
    };

    setFilters(nextFilters);
    await loadCustomers(nextFilters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadCustomers(defaultFilters);
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
    await loadCustomers(nextFilters);
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const customer = await getCustomerById(id);
      setSelectedCustomer(customer);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän asiakkaan?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await deleteCustomer(id);
      await loadCustomers(filters);

      if (selectedCustomer?.customerID === id) {
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
        setShowDetails(false);
      }

      setSuccessMessage("Asiakas poistettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti palauttaa tämän asiakkaan?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await restoreCustomer(id);
      await loadCustomers(filters);

      if (selectedCustomer?.customerID === id) {
        setSelectedCustomer(null);
        setSelectedCustomerId(null);
        setShowDetails(false);
      }

      setSuccessMessage("Asiakas palautettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.customerID, payload);
        setSuccessMessage("Asiakas päivitettiin onnistuneesti.");
      } else {
        await createCustomer(payload);
        setSuccessMessage("Asiakas lisättiin onnistuneesti.");
      }

      setSelectedCustomer(null);
      setFormResetToken((prev) => prev + 1);
      await loadCustomers(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setSelectedCustomerId(null);
      setShowDetails(false);
    }
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
    setSelectedCustomerId(null);
    setShowDetails(false);
    setError("");
    setSuccessMessage("");
  };

  const handleSort = async (columnName) => {
    const nextSort = getNextSortState({
      clickedColumn: columnName,
      currentSortBy: filters.orderBy,
      currentDescending: filters.descending,
      defaultSort,
      descendingFirstColumns: ["CustomerID"],
    });

    const nextFilters = {
      ...filters,
      orderBy: nextSort.orderBy,
      descending: nextSort.descending,
      page: 1,
    };

    setFilters(nextFilters);
    await loadCustomers(nextFilters);
  };

  return (
    <div>
      <h1 className="text-center mb-3">Asiakkaat</h1>

      <div className="row">
        <div className="col-md-6 mb-3">
          <CustomerFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            allCustomers={allCustomers}
          />
          <span>
            <strong>Yhteensä:</strong> {totalCount} asiakasta
          </span>
        </div>
        <PermissionGate permission="customers.manage">
          <div className="col-md-6 mb-3">
            <CustomerForm
              key={
                selectedCustomer
                  ? `${selectedCustomer.customerID}-${formResetToken}`
                  : `new-${formResetToken}`
              }
              selectedCustomer={selectedCustomer}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={Boolean(selectedCustomer)}
            />
          </div>
        </PermissionGate>
      </div>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan asiakkaita...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <>
          <CustomerTable
            customers={customers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onSort={handleSort}
            sortBy={filters.orderBy}
            descending={filters.descending}
            defaultSort={defaultSort}
            selectedCustomerId={selectedCustomerId}
            showDetails={showDetails}
            onToggleDetails={handleToggleDetails}
            onRefreshCustomers={handleRefreshCustomers}
            employees={employees}
            products={products}
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

export default CustomersPage;
