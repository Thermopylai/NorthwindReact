import OrdersPanel from "../orders/OrdersPanel";
import { Fragment } from "react";
import PermissionGate from "../../auth/PermissionGate";

const ShipperTable = ({
  shippers,
  onEdit,
  onDelete,
  onRestore,
  selectedShipperId,
  showDetails,
  onToggleDetails,
  onRefreshShippers,
  customers,
  employees,
  products,
  allOrders,
}) => {
  if (!shippers.length) {
    return <p>Ei kuljettajia.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <th>ID</th>
          <th>Yrityksen nimi</th>
          <th>Puhelin</th>
          <th>Alue</th>
          <th>Poistettu</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {shippers.map((shipper) => {
          const isOpen = selectedShipperId === shipper.shipperID && showDetails;
          const isDeleted = shipper.isDeleted;

          return (
            <Fragment key={shipper.shipperID}>
              <tr
                id={`shipper-row-${shipper.shipperID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td>#{shipper.shipperID}</td>
                <td>{shipper.companyName}</td>
                <td>{shipper.phone}</td>
                <td>{shipper.regionDescription}</td>
                <td>{isDeleted ? "Kyllä" : "Ei"}</td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(shipper.shipperID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${shipper.orderCount != null ? `${shipper.orderCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="shippers.manage">
                    {isDeleted ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(shipper.shipperID)}
                      >
                        Palauta
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => onEdit(shipper.shipperID)}
                        >
                          Muokkaa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(shipper.shipperID)}
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
                        shipperId={shipper.shipperID}
                        onRefreshShippers={onRefreshShippers}
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

export default ShipperTable;
