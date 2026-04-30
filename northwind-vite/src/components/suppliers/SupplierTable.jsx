import { getEffectiveSort } from "../../utils/sortHelpers";
import ProductsPanel from "../products/ProductsPanel";
import { Fragment } from "react";
import PermissionGate from "../../auth/PermissionGate";

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

const SupplierTable = ({
  suppliers,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortBy,
  descending,
  defaultSort,
  onToggleDetails,
  selectedSupplierId,
  showDetails,
  onRefreshSuppliers,
  categories,
}) => {
  if (!suppliers.length) {
    return <p>Ei toimittajia näytettäväksi.</p>;
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
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier) => {
          const isOpen =
            supplier.supplierID === selectedSupplierId &&
            showDetails;  
          const isDeleted = supplier.isDeleted;

          return (
            <Fragment key={supplier.supplierID}>
              <tr
                id={`supplier-row-${supplier.supplierID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
              
              <td>#{supplier.supplierID}</td>
              <td>{supplier.companyName}</td>
              <td>{supplier.contactName}</td>
              <td>{supplier.city}</td>
              <td>{supplier.country}</td>
              <td>{supplier.isDeleted ? "Kyllä" : "Ei"}</td>
              <td className="text-nowrap">
                <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(supplier.supplierID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${supplier.productCount != null ? `${supplier.productCount} kpl` : "-"})`}
                  </button>
                <PermissionGate permission="suppliers.manage">
                  {isDeleted ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onRestore(supplier.supplierID)}
                    >
                      Palauta
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => onEdit(supplier.supplierID)}
                      >
                        Muokkaa
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(supplier.supplierID)}
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
                      <ProductsPanel
                        supplierId={supplier.supplierID}
                        suppliers={suppliers}
                        categories={categories}
                        pageSize={supplier.productCount}
                        onRefreshSuppliers={onRefreshSuppliers}
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

export default SupplierTable;
