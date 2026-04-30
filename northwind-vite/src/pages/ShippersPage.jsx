import { useEffect, useState } from "react";
import ShipperForm from "../components/shippers/ShipperForm";
import ShipperTable from "../components/shippers/ShipperTable";
import {
  getShippers,
  getShipperById,
  createShipper,
  updateShipper,
  deleteShipper,
  restoreShipper,
} from "../api/shippers";
import { 
  getRegions,
  getCustomers,
  getEmployees,
  getProducts,
  getOrders, 
 } from "../api/lookups";
import PermissionGate from "../auth/PermissionGate";

const ShippersPage = () => {
  const [shippers, setShippers] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [selectedShipperId, setSelectedShipperId] = useState(null);
  const [regions, setRegions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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

      const [regionData, shipperData, customerData, employeeData, productData, orderData] = await Promise.all([
        getRegions(),
        getShippers(),
        getCustomers(),
        getEmployees(),
        getProducts(),
        getOrders(),
      ]);

      setRegions(regionData);
      setShippers(shipperData);
      setCustomers(customerData);
      setEmployees(employeeData);
      setProducts(productData);
      setOrders(orderData);
    } catch (err) {
      setRegions([]);
      setShippers([]);
      setCustomers([]);
      setEmployees([]);
      setProducts([]);
      setOrders([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedShipper(null);
    setSelectedShipperId(null);
    loadLookups();
  }, []);

  const handleToggleDetails = (shipperId) => {
    if (selectedShipperId === shipperId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedShipperId(shipperId);
    setShowDetails(true);
  };

  const handleRefreshShippers = async () => {
    await loadLookups();
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const shipper = await getShipperById(id);
      setSelectedShipper(shipper);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän kuljettajan?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      await deleteShipper(id);
      await loadLookups();

      if (selectedShipper?.shipperID === id) {
        setSelectedShipper(null);
        setSelectedShipperId(null);
      }

      setSuccessMessage("Kuljettaja poistettu onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Haluatko varmasti palauttaa tämän kuljettajan?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      await restoreShipper(id);
      await loadLookups();

      if (selectedShipper?.shipperID === id) {
        setSelectedShipper(null);
        setSelectedShipperId(null);
      }

      setSuccessMessage("Kuljettaja palautettu onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedShipper) {
        await updateShipper(selectedShipper.shipperID, payload);
        setSuccessMessage("Kuljettaja päivitetty onnistuneesti.");
      } else {
        await createShipper(payload);
        setSuccessMessage("Kuljettaja lisättiin onnistuneesti.");
      }

      await loadLookups();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setFormResetToken((prev) => prev + 1);
      setSelectedShipper(null);
      setSelectedShipperId(null);
    }
  };

  const handleCancel = () => {
    setSelectedShipper(null);
    setSelectedShipperId(null);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div>
      <h1 className="text-center mb-3">Kuljettajat</h1>
      <PermissionGate permission="shippers.manage">
        <div className="mb-3">
          <ShipperForm
            key={
              selectedShipper
                ? `${selectedShipper.shipperID}-${formResetToken}`
                : `new-${formResetToken}`
            }
            selectedShipper={selectedShipper}
            regions={regions}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={Boolean(selectedShipper)}
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
        <ShipperTable
          shippers={shippers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          selectedShipperId={selectedShipperId}
          showDetails={showDetails}
          onToggleDetails={handleToggleDetails}
          onRefreshShippers={handleRefreshShippers}
          customers={customers}
          employees={employees}
          products={products}
          allOrders={orders}
        />
      )}
    </div>
  );
};

export default ShippersPage;
