import { useEffect, useState, useCallback } from "react";
import OrderDetailTable from "./OrderDetailTable";
import OrderDetailForm from "./OrderDetailForm";
import {
  getOrderDetailsByOrderId,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
  restoreOrderDetail,
} from "../../api/orderDetails";
import PermissionGate from "../../auth/PermissionGate";

const OrderDetailsPanel = ({ orderId, products, onRefreshOrders }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
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

  const loadOrderDetailsByOrderId = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderDetailsByOrderId(orderId);

      setOrderDetails(data);
    } catch (err) {
      setError(err.message);
      setOrderDetails([]);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    setSelectedOrderDetail(null);
    loadOrderDetailsByOrderId();
  }, [orderId, loadOrderDetailsByOrderId]);

  const preserveScrollToOrderRow = async (orderId, asyncAction) => {
    await asyncAction();

    requestAnimationFrame(() => {
      const row = document.getElementById(`order-row-${orderId}`);

      if (row) {
        row.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
      }
    });
  };

  const handleEdit = async ({ orderId, productId }) => {
    try {
      setError("");
      setSuccessMessage("");
      const data = await getOrderDetailById(orderId, productId);
      setSelectedOrderDetail(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async ({ orderId, productId }) => {
    const confirmed = window.confirm(
      "Haluatko varmasti poistaa tämän order detail -rivin?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await preserveScrollToOrderRow(orderId, async () => {
        await deleteOrderDetail(orderId, productId);
        setSelectedOrderDetail(null);
        await loadOrderDetailsByOrderId();
        await onRefreshOrders?.();
        setSuccessMessage("Rivi poistettiin onnistuneesti.");
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async ({ orderId, productId }) => {
    const confirmed = window.confirm(
      "Haluatko varmasti palauttaa tämän order detail -rivin?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await preserveScrollToOrderRow(orderId, async () => {
        await restoreOrderDetail(orderId, productId);
        setSelectedOrderDetail(null);
        await loadOrderDetailsByOrderId();
        await onRefreshOrders?.();
        setSuccessMessage("Rivi palautettiin onnistuneesti.");
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

      await preserveScrollToOrderRow(payload.OrderID, async () => {
        if (selectedOrderDetail) {
          await updateOrderDetail(
            selectedOrderDetail.orderID,
            selectedOrderDetail.productID,
            payload,
          );
          setSuccessMessage("Rivi päivitettiin onnistuneesti.");
        } else {
          await createOrderDetail(payload);
          setSuccessMessage("Rivi lisättiin onnistuneesti.");
        }

        setSelectedOrderDetail(null);
        setFormResetToken((prev) => prev + 1);
        await loadOrderDetailsByOrderId();
        await onRefreshOrders?.();
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedOrderDetail(null);
    setError("");
  };

  return (
    <div className="mb-3">
      <PermissionGate permission="orderdetails.manage">
        <div className="mb-3">
          <OrderDetailForm
            key={
              selectedOrderDetail
                ? `${selectedOrderDetail.orderID}-${selectedOrderDetail.productID}-${formResetToken}`
                : `${orderId}-new-${formResetToken}`
            }
            orderId={orderId}
            selectedOrderDetail={selectedOrderDetail}
            products={products}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={Boolean(selectedOrderDetail)}
          />
        </div>
      </PermissionGate>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan tilausrivejä...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <OrderDetailTable
          orderDetails={orderDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}
      <span className="text-muted">Yhteensä: {orderDetails.length} riviä</span>
    </div>
  );
};

export default OrderDetailsPanel;
