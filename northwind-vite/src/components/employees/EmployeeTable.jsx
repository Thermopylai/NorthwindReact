import PermissionGate from "../../auth/PermissionGate";
import { getEffectiveSort } from "../../utils/sortHelpers";
import OrdersPanel from "../orders/OrdersPanel";
import { Fragment } from "react";

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

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortBy,
  descending,
  defaultSort,
  selectedEmployeeId,
  showDetails,
  onToggleDetails,
  onRefreshEmployees,
  allOrders,
  customers,
  shippers,
  products,
}) => {
  if (!employees.length) {
    return <p>Ei työntekijöitä näytettäväksi.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <SortableHeader
            label="ID"
            column="EmployeeID"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Etunimi"
            column="FirstName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Sukunimi"
            column="LastName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Titteli"
            column="Title"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Syntymäaika"
            column="BirthDate"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Palkkauspvm"
            column="HireDate"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Kotipuhelin"
            column="HomePhone"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Esihenkilö"
            column="ReportsToFullName"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />
          <th>Kuva</th>
          <th>Territoriot</th>
          <th>
            <PermissionGate permission="employees.manage">
              Toiminnot
            </PermissionGate>
          </th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => {
          const isOpen =
            employee.employeeID === selectedEmployeeId && showDetails;
          const isDeleted = employee.isDeleted;

          return (
            <Fragment key={employee.employeeID}>
              <tr
                id={`employee-row-${employee.employeeID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td># {employee.employeeID}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.title}</td>
                <td>{formatDate(employee.birthDate)}</td>
                <td>{formatDate(employee.hireDate)}</td>
                <td>{employee.homePhone}</td>
                <td>{employee.reportsToFullName}</td>
                <td>
                  {employee.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${employee.photo}`}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  ) : (
                    <span>Ei kuvaa</span>
                  )}
                </td>
                <td>
                  {employee.territories
                    ? employee.territories
                        .sort((a, b) =>
                          a.territoryDescription.localeCompare(
                            b.territoryDescription,
                          ),
                        )
                        .map(
                          (t) => `${t.territoryID}: ${t.territoryDescription}`,
                        )
                        .join(", ")
                    : ""}
                </td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(employee.employeeID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${employee.orderCount != null ? `${employee.orderCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="employees.manage">
                    {isDeleted ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(employee.employeeID)}
                      >
                        Palauta
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => onEdit(employee.employeeID)}
                        >
                          Muokkaa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(employee.employeeID)}
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
                        employeeId={employee.employeeID}
                        onRefreshEmployees={onRefreshEmployees}
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

export default EmployeeTable;
