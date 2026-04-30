import { getEffectiveSort } from "../../utils/sortHelpers";
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

const TerritoryTable = ({
  territories,
  onEdit,
  onDelete,
  onRestore,
  onSort,
  sortBy,
  descending,
  defaultSort,
}) => {
  if (!territories.length) {
    return <p>Ei alueita näytettäväksi.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <SortableHeader
            label="Postinumero"
            column="TerritoryID"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <SortableHeader
            label="Postitoimipaikka"
            column="TerritoryDescription"
            sortBy={sortBy}
            descending={descending}
            onSort={onSort}
            defaultSort={defaultSort}
          />

          <th>Alue</th>

          <th>Poistettu</th>
          <th>
            <PermissionGate permission="territories.manage">
              Toiminnot
            </PermissionGate>
          </th>
        </tr>
      </thead>
      <tbody>
        {territories.map((territory) => {
          const isDeleted = territory.isDeleted;

          return (
            <tr
              key={territory.territoryID}
              className={isDeleted ? "table-danger" : ""}
            >
              <td>{territory.territoryID}</td>
              <td>{territory.territoryDescription}</td>
              <td>{territory.regionDescription}</td>
              <td>{isDeleted ? "Kyllä" : "Ei"}</td>
              <td className="text-nowrap">
                <PermissionGate permission="territories.manage">
                  {isDeleted ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onRestore(territory.territoryID)}
                    >
                      Palauta
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => onEdit(territory.territoryID)}
                      >
                        Muokkaa
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(territory.territoryID)}
                      >
                        Poista
                      </button>
                    </>
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

export default TerritoryTable;
