import { useEffect, useState } from "react";
import TerritoryForm from "./TerritoryForm";
import TerritoryTable from "./TerritoryTable";
import {
  searchTerritories,
  getTerritoryById,
  createTerritory,
  updateTerritory,
  deleteTerritory,
  restoreTerritory,
} from "../../api/territories";
import PermissionGate from "../../auth/PermissionGate";
import { getNextSortState } from "../../utils/sortHelpers";

const defaultSort = {
  orderBy: "",
  descending: false,
};

const defaultFilters = {
  regionId: "",
  isDeleted: "",
  searchTerm: "",
  orderBy: defaultSort.orderBy,
  descending: defaultSort.descending,
  page: 1,
  pageSize: 10,
};

const TerritoriesPanel = ({ regionId, pageSize, onRefreshRegions }) => {
  const [territories, setTerritories] = useState([]);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [formResetToken, setFormResetToken] = useState(0);

  const [filters, setFilters] = useState({
    ...defaultFilters,
    regionId,
    pageSize,
  });

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

  const loadTerritories = async (activeFilters) => {
    try {
      setLoading(true);
      setError("");

      const data = await searchTerritories(activeFilters);

      setTerritories(data.items);
    } catch (err) {
      setError(err.message);
      setTerritories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerritories(filters);
  }, [filters]);

  const preserveScrollToRegionRow = async (regionId, asyncAction) => {
    await asyncAction();

    requestAnimationFrame(() => {
      const row = document.getElementById(`region-row-${regionId}`);

      if (row) {
        row.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
      }
    });
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const territory = await getTerritoryById(id);
      setSelectedTerritory(territory);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Haluatko varmasti poistaa alueen?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await preserveScrollToRegionRow(regionId, async () => {
        await deleteTerritory(id);
        setSelectedTerritory(null);
        await loadTerritories(filters);
        await onRefreshRegions();
        setSuccessMessage("Alue poistettiin onnistuneesti.");
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm("Haluatko varmasti palauttaa alueen?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await preserveScrollToRegionRow(regionId, async () => {
        await restoreTerritory(id);
        setSelectedTerritory(null);
        await loadTerritories(filters);
        await onRefreshRegions();
        setSuccessMessage("Alue palautettiin onnistuneesti.");
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

      await preserveScrollToRegionRow(regionId, async () => {
        if (selectedTerritory) {
          await updateTerritory(selectedTerritory.territoryID, payload);
          setSuccessMessage("Alue päivitettiin onnistuneesti.");
        } else {
          await createTerritory(payload);
          setSuccessMessage("Alue lisättiin onnistuneesti.");
        }

        setSelectedTerritory(null);
        setFormResetToken((prev) => prev + 1);
        await loadTerritories(filters);
        await onRefreshRegions?.();
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedTerritory(null);
    setError("");
  };

  const handleSort = async (columnName) => {
    const nextSort = getNextSortState({
      clickedColumn: columnName,
      currentSortBy: filters.orderBy,
      currentDescending: filters.descending,
      defaultSort,
      descendingFirstColumns: ["TerritoryID"],
    });

    const nextFilters = {
      ...filters,
      orderBy: nextSort.orderBy,
      descending: nextSort.descending,
      page: 1,
      pageSize: pageSize, // Keep page size when changing sort to avoid resetting to first page with 10 items when region has more territories.
    };

    setFilters(nextFilters);
    await loadTerritories(nextFilters);
  };

  return (
    <div className="mb-3">
      <PermissionGate permission="territories.manage">
        <div className="mb-3">
          <TerritoryForm
            key={
              selectedTerritory
                ? `${selectedTerritory.territoryID}-${formResetToken}`
                : `${regionId}-new-${formResetToken}`
            }
            regionId={regionId}
            selectedTerritory={selectedTerritory}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={Boolean(selectedTerritory)}
          />
        </div>
      </PermissionGate>

      <div className="mb-3">
        {saving && <p>Tallennetaan...</p>}
        {loading && <p>Ladataan alueita...</p>}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </div>

      {!loading && (
        <TerritoryTable
          territories={territories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onSort={handleSort}
          sortBy={filters.orderBy}
          descending={filters.descending}
          defaultSort={defaultSort}
        />
      )}
      <span className="text-muted">Yhteensä: {territories.length} aluetta</span>
    </div>
  );
};

export default TerritoriesPanel;
