import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import InputField from "../UI/InputField";
import toast from "react-hot-toast";
import CreateHmo from "./insurance-hmo/CreateHmo";
import HmoProfile from "./insurance-hmo/HmoProfile";
import Packages from "./insurance-hmo/Packages";
import Settings from "./insurance-hmo/Settings";

function Insurance() {
  // Sample data with a patient's name
  const [selectedTab, setSelectedTab] = useState("create-hmo");
  const [newData, setNewData] = useState([]);
  const [available, setAvailable] = useState(0);
  const [occupied, setOccupied] = useState(0);
  const [hmoData, setHmoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const data = [
    {
      patientName: "William Humphrey",
      InsuranceId: "A1",
      occupied: true,
    },
  ];

  const fetchHMOData = async (page, size) => {
    setLoading(true);
    try {
      const data = await get(`/hmo/list/${page}/${size}`);
      setHmoData(data.resultList); // Adjust this based on the actual response structure
      setTotalPages(data?.paginationMetadata?.totalPages); // Set total pages from response
    } catch (e) {
      console.error("Error fetching HMO data: ", e);
    }
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await get(`/insurance/create-hmo`);

      setNewData(response);
      calculateOccupied(response);
      calculateAvailable(response);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateOccupied = (data) => {
    const occupied = data.filter(
      (item) => item.isOccupied === "Occupied"
    ).length;
    setOccupied(occupied);
  };

  const calculateAvailable = (data) => {
    const available = data.filter(
      (item) => item.isOccupied === "Vacant"
    ).length;
    setAvailable(available);
  };

  useEffect(() => {
    // fetchData();
    fetchHMOData(currentPage, pageSize);
  }, []);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "create-hmo":
        return (
          <div>
            <CreateHmo />
          </div>
        );
      case "hmo-profile":
        return (
          <div>
            <HmoProfile />
          </div>
        );
      case "packages":
        return (
          <div>
            {/* Pricing form */}
            <div
              style={{
                marginBottom: 20,
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
              }}
            >
              <h4 style={{ marginBottom: 8 }}>Add HMO Pricing</h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="label">HMO</label>
                  <select
                    value={hmoPricing.hmoId}
                    onChange={(e) =>
                      setHmoPricing((p) => ({
                        ...p,
                        hmoId: Number(e.target.value),
                      }))
                    }
                    className="input-field"
                  >
                    <option value="">Select HMO</option>
                    {hmoOptions.map((h) => (
                      <option key={h.value} value={h.value}>
                        {h.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Billable Type</label>
                  <select
                    value={hmoPricing.billableTypeId}
                    onChange={(e) =>
                      setHmoPricing((p) => ({
                        ...p,
                        billableTypeId: Number(e.target.value),
                      }))
                    }
                    className="input-field"
                  >
                    <option value="">Select Type</option>
                    {billableTypeOptions.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Billable Item</label>
                  <select
                    value={hmoPricing.billableItemId}
                    onChange={(e) =>
                      setHmoPricing((p) => ({
                        ...p,
                        billableItemId: Number(e.target.value),
                      }))
                    }
                    className="input-field"
                  >
                    <option value="">Select Item</option>
                    {billableItemOptions.map((it) => (
                      <option key={it.value} value={it.value}>
                        {it.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <InputField
                    label="Agreed Price"
                    value={hmoPricing.agreedPrice}
                    onChange={(e) =>
                      setHmoPricing((p) => ({
                        ...p,
                        agreedPrice: e.target.value,
                      }))
                    }
                    type="number"
                  />
                </div>

                <div>
                  <label className="label">Effective From</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={hmoPricing.effectiveFrom}
                    onChange={(e) =>
                      setHmoPricing((p) => ({
                        ...p,
                        effectiveFrom: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="label">Effective To</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={hmoPricing.effectiveTo}
                    onChange={(e) =>
                      setHmoPricing((p) => ({
                        ...p,
                        effectiveTo: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn"
                  onClick={handleCreatePricing}
                  disabled={creatingPricing}
                >
                  {creatingPricing ? "Saving..." : "Save Pricing"}
                </button>
              </div>
            </div>

            {/* <div style={{ marginTop: 12 }}>
              <Packages />
            </div> */}
          </div>
        );
      case "settings":
        return (
          <div>
            <Settings />
          </div>
        );
      default:
        return null;
    }
  };

  // --- Pricing state and helpers ---
  const [hmoOptions, setHmoOptions] = useState([]);
  const [billableTypeOptions, setBillableTypeOptions] = useState([]);
  const [billableItemOptions, setBillableItemOptions] = useState([]);
  const [hmoPricing, setHmoPricing] = useState({
    hmoId: "",
    billableTypeId: "",
    billableItemId: "",
    agreedPrice: "",
    effectiveFrom: "",
    effectiveTo: "",
  });
  const [creatingPricing, setCreatingPricing] = useState(false);

  useEffect(() => {
    // fetch HMO options
    const fetchOptions = async () => {
      try {
        const res = await get("/hmo/list/1/100");
        const list = res?.resultList || res || [];
        const hmos = Array.isArray(list)
          ? list.map((h) => ({ label: h.vendorName, value: h.id }))
          : [];
        setHmoOptions(hmos);
      } catch (err) {
        console.error("Failed to load HMO options", err);
      }

      // Try fetch billable types and items; endpoints assumed - adjust if different
      try {
        const bt = await get("/billable-type/list/1/100");
        const btList = bt?.resultList || bt || [];
        setBillableTypeOptions(
          Array.isArray(btList)
            ? btList.map((b) => ({
                label: b.name || b.type || b.description || b.id,
                value: b.id,
              }))
            : []
        );
      } catch (e) {
        console.warn("/billable-type endpoint missing or failed", e);
        setBillableTypeOptions([]);
      }

      try {
        const bi = await get("/billable-item/list/1/100");
        const biList = bi?.resultList || bi || [];
        setBillableItemOptions(
          Array.isArray(biList)
            ? biList.map((i) => ({
                label: i.name || i.description || i.id,
                value: i.id,
              }))
            : []
        );
      } catch (e) {
        console.warn("/billable-item endpoint missing or failed", e);
        setBillableItemOptions([]);
      }
    };
    fetchOptions();
  }, []);

  const handleCreatePricing = async () => {
    // basic validation
    if (
      !hmoPricing.hmoId ||
      !hmoPricing.billableTypeId ||
      !hmoPricing.billableItemId
    ) {
      toast.error("Please select HMO, billable type and item.");
      return;
    }

    const payload = {
      hmoId: Number(hmoPricing.hmoId),
      billableTypeId: Number(hmoPricing.billableTypeId),
      billableItemId: Number(hmoPricing.billableItemId),
      agreedPrice: Number(hmoPricing.agreedPrice) || 0,
      effectiveFrom: hmoPricing.effectiveFrom
        ? new Date(hmoPricing.effectiveFrom).toISOString()
        : null,
      effectiveTo: hmoPricing.effectiveTo
        ? new Date(hmoPricing.effectiveTo).toISOString()
        : null,
    };

    try {
      setCreatingPricing(true);
      // Assumed endpoint - adjust to your API path if needed
      await post("/hmo/pricing", payload);
      toast.success("Pricing added");
      // reset form
      setHmoPricing({
        hmoId: "",
        billableTypeId: "",
        billableItemId: "",
        agreedPrice: "",
        effectiveFrom: "",
        effectiveTo: "",
      });
    } catch (err) {
      console.error("Failed to create pricing", err);
      toast.error("Failed to create pricing");
    } finally {
      setCreatingPricing(false);
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-20">...</div>
      <div className="m-t-20 bold-text">HMO/Insurance Management</div>

      <div className="tabs flex m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "create-hmo" ? "active" : ""}`}
          onClick={() => setSelectedTab("create-hmo")}
        >
          Create Hmo
        </div>

        <div
          className={`tab-item ${selectedTab === "packages" ? "active" : ""}`}
          onClick={() => setSelectedTab("packages")}
        >
          Setup HMO Pricing
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
}

export default Insurance;
