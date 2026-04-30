import PermissionGate from "../../auth/PermissionGate";
import { getEffectiveSort } from "../../utils/sortHelpers";
import OrderDetailsPanel from "../orderDetails/OrderDetailsPanel";
import { Fragment } from "react";

const formatCurrency = (value) => {
  if (value == null) {
    return "-";
  }

  return Number(value).toLocaleString("fi-FI", {
    style: "currency",
    currency: "EUR",
  });
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("fi-FI");
};

const SortableHeader = ({
  label,
  column,
  sortBy,
  descending,
  onSort,
  defaultSort,
}) => {
  const effectiveSort = getEffectiveSort(sortBy, descending, defaultSort);
  const isActive = effectiveSort.sortBy === column;

  const arrow = isActive ? (effectiveSort.descending ? " ↓" : " ↑") : "";

  return (
    <th
      onClick={() => onSort(column)}
      title={`Lajittele sarakkeen ${label} mukaan`}
      className={`sortable-header ${isActive ? "active-sort" : ""}`}
    >
      <span>{label}</span>
      <span style={{ marginLeft: "0.35rem" }}>{arrow}</span>
    </th>
  );
};

const OrderTable = ({
  orders,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortBy,
  descending,
  defaultSort,
  selectedOrderId,
  showDetails,
  onToggleDetails,
  products,
  onRefreshOrders,
}) => {
  if (!orders.length) {
    return <p>Ei tilauksia näytettäväksi.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <SortableHeader
            label="Tilaus"
            column="OrderID"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Asiakas"
            column="CustomerCompanyName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Työntekijä"
            column="EmployeeFullName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Tilauspäivä"
            column="OrderDate"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Kuljettaja"
            column="ShipViaCompanyName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Maa"
            column="ShipCountry"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Yhteensä"
            column="TotalAmount"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="ALV"
            column="TotalVatAmount"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Rahti"
            column="Freight"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Lopullinen"
            column="FinalAmount"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />
          <th>Poistettu</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const isOpen = selectedOrderId === order.orderID && showDetails;
          const isDeleted = order.isDeleted;

          return (
            <Fragment key={order.orderID}>
              <tr
                id={`order-row-${order.orderID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td>#{order.orderID}</td>
                <td>{order.customerCompanyName ?? order.customerID ?? "-"}</td>
                <td>{order.employeeFullName ?? "-"}</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{order.shipViaCompanyName ?? "-"}</td>
                <td>{order.shipCountry ?? "-"}</td>
                <td>{formatCurrency(order.totalAmount)}</td>
                <td>{formatCurrency(order.totalVatAmount)}</td>
                <td>{formatCurrency(order.freight)}</td>
                <td>{formatCurrency(order.finalAmount)}</td>
                <td>{order.isDeleted ? "Kyllä" : "Ei"}</td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(order.orderID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${order.orderRowCount != null ? `${order.orderRowCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="orders.manage">
                    <button
                      className="me-1 btn btn-sm btn-primary"
                      onClick={() => onEdit(order.orderID)}
                    >
                      Muokkaa
                    </button>

                    {!isDeleted && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(order.orderID)}
                      >
                        Poista
                      </button>
                    )}

                    {isDeleted && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(order.orderID)}
                      >
                        Palauta
                      </button>
                    )}
                  </PermissionGate>
                </td>
              </tr>

              {isOpen && (
                <tr>
                  <td colSpan="12" className="p-0 border-0">
                    <div className="border-start border-bottom border-4 border-primary rounded-bottom p-3">
                      <OrderDetailsPanel
                        orderId={order.orderID}
                        products={products}
                        onRefreshOrders={onRefreshOrders}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrderTable;
