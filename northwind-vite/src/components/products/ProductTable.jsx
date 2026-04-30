import { getEffectiveSort } from "../../utils/sortHelpers";
import PermissionGate from "../../auth/PermissionGate";
import OrdersPanel from "../orders/OrdersPanel";
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

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortBy,
  descending,
  defaultSort,
  selectedProductId,
  showDetails,
  onToggleDetails,
  onRefreshProducts,
  allOrders,
  employees,
  shippers,
  customers,
}) => {
  if (!products.length) {
    return <p>Ei tuotteita näytettäväksi.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <SortableHeader
            label="ID"
            column="ProductID"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Nimi"
            column="ProductName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Toimittaja"
            column="SupplierName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Kategoria"
            column="CategoryName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <th>Yksikkömäärä</th>

          <SortableHeader
            label="Hinta"
            column="UnitPrice"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Hinta + ALV"
            column="PriceWithVat"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Varastossa"
            column="UnitsInStock"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Arvo"
            column="StockValue"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Arvo + ALV"
            column="StockValueWithVat"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <th>Lopetettu</th>
          <th>
            <PermissionGate permission="products.manage">
              Toiminnot
            </PermissionGate>
          </th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => {
          const isOpen = product.productID === selectedProductId && showDetails;
          const isDeleted = product.discontinued;

          return (
            <Fragment key={product.productID}>
              <tr
                id={`product-row-${product.productID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td>#{product.productID}</td>
                <td>{product.productName}</td>
                <td>{product.supplierName ?? "-"}</td>
                <td>{product.categoryName ?? "-"}</td>
                <td>{product.quantityPerUnit ?? "-"}</td>
                <td>{formatCurrency(product.unitPrice)}</td>
                <td>{formatCurrency(product.priceWithVat)}</td>
                <td>
                  {product.unitsInStock != null
                    ? `${product.unitsInStock} kpl`
                    : "-"}
                </td>
                <td>{formatCurrency(product.stockValue)}</td>
                <td>{formatCurrency(product.stockValueWithVat)}</td>
                <td>{product.discontinued ? "Kyllä" : "Ei"}</td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(product.productID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${product.orderDetailsCount != null ? `${product.orderDetailsCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="products.manage">
                    {isDeleted ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(product.productID)}
                      >
                        Palauta
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => onEdit(product.productID)}
                        >
                          Muokkaa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(product.productID)}
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
                        productId={product.productID}
                        isFromProductTable={Boolean(product.productID)}
                        onRefreshProducts={onRefreshProducts}
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

export default ProductTable;
