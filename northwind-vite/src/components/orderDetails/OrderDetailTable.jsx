import PermissionGate from "../../auth/PermissionGate";

const formatCurrency = (value) => {
  if (value == null) {
    return "-";
  }

  return Number(value).toLocaleString("fi-FI", {
    style: "currency",
    currency: "EUR",
  });
};

const formatPercent = (value) => {
  if (value == null) {
    return "-";
  }

  return Number(value).toLocaleString("fi-FI", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const OrderDetailTable = ({ orderDetails, onEdit, onDelete, onRestore }) => {
  if (!orderDetails.length) {
    return <p>Tällä tilauksella ei ole rivejä.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <th>Tilaus</th>
          <th>TuoteID</th>
          <th>Tuote</th>
          <th>Yksikköhinta</th>
          <th>Määrä</th>
          <th>Alennus</th>
          <th>Yhteensä</th>
          <th>Verollinen</th>
          <th>Poistettu</th>
          <th>
            <PermissionGate permission="orderdetails.manage">
              Toiminnot
            </PermissionGate>
          </th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.map((row) => {
          const isDeleted = row.isDeleted;

          return (
            <tr
              key={`${row.orderID}-${row.productID}`}
              className={isDeleted ? "table-danger" : ""}
            >
              <td>#{row.orderID}</td>
              <td>#{row.productID}</td>
              <td>{row.productName ?? "-"}</td>
              <td>{formatCurrency(row.unitPrice)}</td>
              <td>{row.quantity != null ? `${row.quantity} kpl` : "-"}</td>
              <td>{formatPercent(row.discount)}</td>
              <td>{formatCurrency(row.priceWithDiscount)}</td>
              <td>{formatCurrency(row.priceWithVat)}</td>
              <td>{row.isDeleted ? "Kyllä" : "Ei"}</td>
              <td className="text-nowrap">
                <PermissionGate permission="orderdetails.manage">
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() =>
                      onEdit({
                        orderId: row.orderID,
                        productId: row.productID,
                      })
                    }
                  >
                    Muokkaa
                  </button>

                  {!isDeleted && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        onDelete({
                          orderId: row.orderID,
                          productId: row.productID,
                        })
                      }
                    >
                      Poista
                    </button>
                  )}

                  {isDeleted && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        onRestore({
                          orderId: row.orderID,
                          productId: row.productID,
                        })
                      }
                    >
                      Palauta
                    </button>
                  )}
                </PermissionGate>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrderDetailTable;
