import { getEffectiveSort } from "../../utils/sortHelpers";
import PermissionGate from "../../auth/PermissionGate";
import OrdersPanel from "../orders/OrdersPanel";
import { Fragment } from "react";

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

const CustomerTable = ({
  customers,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortBy,
  descending,
  defaultSort,
  selectedCustomerId,
  showDetails,
  onToggleDetails,
  onRefreshCustomers,
  allOrders,
  employees,
  shippers,
  products,
}) => {
  if (!customers.length) {
    return <p>Ei asiakkaita näytettäväksi.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <SortableHeader
            label="ID"
            column="CustomerID"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Yritys"
            column="CompanyName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />
          <SortableHeader
            label="Yhteyshenkilö"
            column="ContactName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />
          <SortableHeader
            label="Kaupunki"
            column="City"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />
          <SortableHeader
            label="Maa"
            column="Country"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />
          <th>Poistettu</th>
          <th>
            <PermissionGate permission="customers.manage">
              Toiminnot
            </PermissionGate>
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => {
          const isOpen =
            selectedCustomerId === customer.customerID && showDetails;
          const isDeleted = customer.isDeleted;

          return (
            <Fragment key={customer.customerID}>
              <tr
                id={`customer-row-${customer.customerID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td>{customer.customerID}</td>
                <td>{customer.companyName}</td>
                <td>{customer.contactName}</td>
                <td>{customer.city}</td>
                <td>{customer.country}</td>
                <td>{customer.isDeleted ? "Kyllä" : "Ei"}</td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(customer.customerID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${customer.orderCount != null ? `${customer.orderCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="customers.manage">
                    {isDeleted ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(customer.customerID)}
                      >
                        Palauta
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => onEdit(customer.customerID)}
                        >
                          Muokkaa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(customer.customerID)}
                        >
                          Poista
                        </button>
                      </>
                    )}
                  </PermissionGate>
                </td>
              </tr>
              {isOpen && (
                <tr>
                  <td colSpan="12" className="p-0 border-0">
                    <div className="border-start border-bottom border-4 border-primary rounded-bottom p-3">
                      <OrdersPanel
                        customerId={customer.customerID}
                        onRefreshCustomers={onRefreshCustomers}
                        customers={customers}
                        employees={employees}
                        products={products}
                        shippers={shippers}
                        allOrders={allOrders}
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

export default CustomerTable;
