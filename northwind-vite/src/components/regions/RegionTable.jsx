import TerritoriesPanel from "../territories/TerritoriesPanel";
import { Fragment } from "react";
import PermissionGate from "../../auth/PermissionGate";

const RegionTable = ({
  regions,
  onEdit,
  onDelete,
  onRestore,
  selectedRegionId,
  showDetails,
  onToggleDetails,
  onRefreshRegions,
}) => {
  if (!regions.length) {
    return <p>Ei alueita.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <th>ID</th>
          <th>Alueen nimi</th>
          <th>Poistettu</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {regions.map((region) => {
          const isOpen = selectedRegionId === region.regionID && showDetails;
          const isDeleted = region.isDeleted;

          return (
            <Fragment key={region.regionID}>
              <tr
                id={`region-row-${region.regionID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td># {region.regionID}</td>
                <td>{region.regionDescription}</td>
                <td>{isDeleted ? "Kyllä" : "Ei"}</td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(region.regionID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${region.territoryCount != null ? `${region.territoryCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="regions.manage">
                    {isDeleted ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(region.regionID)}
                      >
                        Palauta
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => onEdit(region.regionID)}
                        >
                          Muokkaa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(region.regionID)}
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
                    <div className="border-start border-4 border-primary rounded-bottom p-3">
                      <TerritoriesPanel
                        regionId={region.regionID}
                        pageSize={region.territoryCount}
                        onRefreshRegions={onRefreshRegions}
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

export default RegionTable;
