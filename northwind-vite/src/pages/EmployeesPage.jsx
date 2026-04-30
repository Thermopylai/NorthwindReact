import { useEffect, useState } from "react";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeFilters from "../components/employees/EmployeeFilters";
import {
  searchEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
} from "../api/employees";
import {
  getTerritories,
  getEmployees,
  getCustomers,
  getProducts,
  getOrders,
  getShippers,
} from "../api/lookups";
import { getNextSortState } from "../utils/sortHelpers";
import PermissionGate from "../auth/PermissionGate";

const defaultSort = {
  orderBy: "",
  descending: false,
};

const defaultFilters = {
  start: "",
  end: "",
  isDeleted: "",
  reportsTo: "",
  territoryId: "",
  searchTerm: "",
  orderBy: defaultSort.orderBy,
  descending: defaultSort.descending,
  page: 1,
  pageSize: 2,
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
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

  const loadLookups = async () => {
    try {
      setLoading(true);
      setError("");
      const [
        territoryData,
        employeeData,
        customerData,
        productData,
        orderData,
        shipperData,
      ] = await Promise.all([
        getTerritories(),
        getEmployees(),
        getCustomers(),
        getProducts(),
        getOrders(),
        getShippers(),
      ]);
      setAllEmployees(employeeData);
      setTotalCount(employeeData.length); // Set total count based on all employees.
      setTerritories(territoryData);
      setCustomers(customerData);
      setProducts(productData);
      setOrders(orderData);
      setShippers(shipperData);
    } catch (err) {
      setTerritories([]);
      setCustomers([]);
      setProducts([]);
      setOrders([]);
      setShippers([]);
      setError(err.message);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");
      const data = await searchEmployees(activeFilters);
      setEmployees(data.items);
    } catch (err) {
      setEmployees([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookups();
    loadEmployees({ ...defaultFilters, pageSize: totalCount }); // Load employees with pageSize set to totalCount to show all employees on initial load.
  }, [totalCount]);

  const handleToggleDetails = (employeeId) => {
    if (selectedEmployeeId === employeeId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedEmployeeId(employeeId);
    setShowDetails(true);
  };

  const handleRefreshEmployees = async () => {
    await loadLookups();
  };

  const handleSearch = async () => {
    const nextFilters = {
      ...filters,
      page: 1,
    };

    setFilters(nextFilters);
    await loadEmployees(nextFilters);
  };

  const handleReset = async () => {
    setFilters(defaultFilters);
    await loadEmployees({ ...defaultFilters, pageSize: totalCount }); // Reset with pageSize set to totalCount to show all employees after reset.
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const employee = await getEmployeeById(id);
      setSelectedEmployee(employee);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän työntekijän?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await deleteEmployee(id);
      await loadEmployees(filters);

      if (selectedEmployee?.employeeID === id) {
        setSelectedEmployee(null);
        setSelectedEmployeeId(null);
        setShowDetails(false);
      }

      setSuccessMessage("Työntekijä poistettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Haluatko varmasti palauttaa tämän työntekijän?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await restoreEmployee(id);
      await loadEmployees(filters);

      if (selectedEmployee?.employeeID === id) {
        setSelectedEmployee(null);
        setSelectedEmployeeId(null);
        setShowDetails(false);
      }

      setSuccessMessage("Työntekijä palautettiin onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.employeeID, payload);
        setSuccessMessage("Työntekijä päivitettiin onnistuneesti.");
      } else {
        await createEmployee(payload);
        setSuccessMessage("Työntekijä lisättiin onnistuneesti.");
      }

      setSelectedEmployee(null);
      setFormResetToken((prev) => prev + 1);
      await loadEmployees(filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setSelectedEmployee(null);
      setSelectedEmployeeId(null);
      setShowDetails(false);
      setFormResetToken((prev) => prev + 1); // Reset form by changing key
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
    setError("");
    setSuccessMessage("");
    setSelectedEmployeeId(null);
    setShowDetails(false);
  };

  const handleSort = async (columnName) => {
    const nextSort = getNextSortState({
      clickedColumn: columnName,
      currentSortBy: filters.orderBy,
      currentDescending: filters.descending,
      defaultSort,
      descendingFirstColumns: ["EmployeeID"],
    });

    const nextFilters = {
      ...filters,
      orderBy: nextSort.orderBy,
      descending: nextSort.descending,
      page: 1,
      pageSize: totalCount, // Show all when changing sort.
    };

    setFilters(nextFilters);
    await loadEmployees(nextFilters);
  };

  return (
    <div>
      <h1>Työntekijät</h1>

      <div className="row">
        <div className="col-md-6 mb-3">
          <EmployeeFilters
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            territories={territories}
            allEmployees={allEmployees}
          />
          <span>
            <strong>Yhteensä:</strong> {totalCount} työntekijää
          </span>
        </div>
        <PermissionGate permission="employees.manage">
          <div className="col-md-6 mb-3">
            <EmployeeForm
              key={
                selectedEmployee
                  ? `${selectedEmployee.employeeID}-${formResetToken}`
                  : `new-${formResetToken}`
              }
              selectedEmployee={selectedEmployee}
              territories={territories}
              allEmployees={allEmployees}
              onSave={handleSave}
              onCancel={handleCancel}
              isEditing={Boolean(selectedEmployee)}
            />
          </div>
        </PermissionGate>
      </div>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan työntekijöitä...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <>
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onSort={handleSort}
            sortBy={filters.orderBy}
            descending={filters.descending}
            defaultSort={defaultSort}
            selectedEmployeeId={selectedEmployeeId}
            showDetails={showDetails}
            onToggleDetails={handleToggleDetails}
            onRefreshEmployees={handleRefreshEmployees}
            customers={customers}
            products={products}
            allOrders={orders}
            shippers={shippers}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesPage;
