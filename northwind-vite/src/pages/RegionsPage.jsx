import { useEffect, useState } from "react";
import RegionForm from "../components/regions/RegionForm";
import RegionTable from "../components/regions/RegionTable";
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  restoreRegion,
} from "../api/regions";
import PermissionGate from "../auth/PermissionGate";

const RegionsPage = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formResetToken, setFormResetToken] = useState(0);

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

  const loadRegions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getRegions();
      setRegions(data);
    } catch (err) {
      setError(err.message);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedRegion(null);
    setSelectedRegionId(null);
    loadRegions();
  }, []);

  const handleToggleDetails = (regionId) => {
    if (selectedRegionId === regionId) {
      setShowDetails((prev) => !prev);
      return;
    }

    setSelectedRegionId(regionId);
    setShowDetails(true);
  };

  const handleRefreshRegions = async () => {
    await loadRegions();
  };

  const handleEdit = async (id) => {
    try {
      setError("");
      setSuccessMessage("");
      const region = await getRegionById(id);
      setSelectedRegion(region);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa tämän alueen?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      await deleteRegion(id);
      await loadRegions();

      if (selectedRegion?.regionID === id) {
        setSelectedRegion(null);
        setSelectedRegionId(null);
      }

      setSuccessMessage("Alue poistettu onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Haluatko varmasti palauttaa tämän alueen?")) {
      return;
    }
    try {
      setError("");
      setSuccessMessage("");
      await restoreRegion(id);
      await loadRegions();

      if (selectedRegion?.regionID === id) {
        setSelectedRegion(null);
        setSelectedRegionId(null);
      }

      setSuccessMessage("Alue palautettu onnistuneesti.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (selectedRegion) {
        await updateRegion(selectedRegion.regionID, payload);
        setSuccessMessage("Alue päivitetty onnistuneesti.");
      } else {
        await createRegion(payload);
        setSuccessMessage("Alue lisättiin onnistuneesti.");
      }

      await loadRegions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setFormResetToken((prev) => prev + 1);
      setSelectedRegion(null);
      setSelectedRegionId(null);
    }
  };

  const handleCancel = () => {
    setSelectedRegion(null);
    setSelectedRegionId(null);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div>
      <h1 className="text-center mb-3">Alueet</h1>
      <PermissionGate permission="regions.manage">
        <div className="mb-3">
          <RegionForm
            key={
              selectedRegion
                ? `${selectedRegion.regionID}-${formResetToken}`
                : `new-${formResetToken}`
            }
            selectedRegion={selectedRegion}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={Boolean(selectedRegion)}
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
        <RegionTable
          regions={regions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          selectedRegionId={selectedRegionId}
          showDetails={showDetails}
          onToggleDetails={handleToggleDetails}
          onRefreshRegions={handleRefreshRegions}
        />
      )}
    </div>
  );
};

export default RegionsPage;
