import React, { useEffect, useState } from "react";
import { get, post } from "../../utility/fetch";
import { get as gets, post as posts, put, del } from "../../utility/fetch2";
import { get as getPharm } from "../../utility/fetchPharm";

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
                    onChange={(e) => {
                      const selectedTypeId = Number(e.target.value);
                      setHmoPricing((p) => ({
                        ...p,
                        billableTypeId: selectedTypeId,
                        billableItemId: "", // Reset billable item when type changes
                      }));

                      // Update billable items based on selected type
                      let itemsToMap = [];
                      if (selectedTypeId === 5) {
                        // Assuming type 5 is for category items
                        itemsToMap = itemList;
                      } else if (selectedTypeId === 4) {
                        // Assuming type 4 is for inventory items
                        itemsToMap = inventoryList;
                      } else if (selectedTypeId === 3) {
                        // Assuming type 3 is for lab services
                        itemsToMap = labServiceList;
                      } else if (selectedTypeId === 2) {
                        // Assuming type 2 is for equipment
                        itemsToMap = equipmentList;
                      } else if (selectedTypeId === 1) {
                        // Assuming type 1 is for beds
                        itemsToMap = bedList;
                      }

                      setBillableItemOptions(
                        Array.isArray(itemsToMap)
                          ? itemsToMap.map((item) => ({
                              label:
                                item.itemName ||
                                item.name ||
                                item.serviceName ||
                                item.productName,
                              value: item.id,
                            }))
                          : []
                      );
                    }}
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

            <div className="w-100 m-t-20">
              <label className="label">Select HMO to view agreed prices</label>
              <select
                value={selectedHmoForPrices}
                onChange={(e) => {
                  const hmoId = e.target.value;
                  setSelectedHmoForPrices(hmoId);
                  fetchHmoAgreedPrices(hmoId);
                }}
                className="input-field"
                style={{ width: "300px" }}
              >
                <option value="">Select HMO</option>
                {hmoOptions.map((hmo) => (
                  <option key={hmo.value} value={hmo.value}>
                    {hmo.label}
                  </option>
                ))}
              </select>

              {loadingAgreedPrices && (
                <div className="m-t-10 font-xs">Loading agreed prices...</div>
              )}

              {selectedHmoForPrices &&
                !loadingAgreedPrices &&
                hmoAgreedPrices.length > 0 && (
                  <div className="w-100 m-t-20">
                    <h4 className="m-b-20">
                      Agreed Prices ({hmoAgreedPrices.length} items)
                    </h4>
                    <table className="bordered-table">
                      <thead className="border-top-none">
                        <tr className="border-top-none">
                          <th className="w-5">#</th>
                          <th className="w-20">HMO Name</th>
                          <th className="w-30">Item/Service Name</th>
                          <th className="w-15">Agreed Price</th>
                          <th className="w-15">Effective Date</th>
                          <th className="w-15">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="white-bg view-det-pane">
                        {hmoAgreedPrices.map((price, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="font-weight-medium">
                              {hmoOptions.find(
                                (hmo) =>
                                  hmo.value === Number(selectedHmoForPrices)
                              )?.label || "Unknown HMO"}
                            </td>
                            <td>
                              {price.billableItemName ||
                                price.serviceName ||
                                price.name ||
                                `Item ${index + 1}`}
                            </td>
                            <td className="positiveBalance">
                              ₦
                              {(
                                price.agreedPrice ||
                                price.price ||
                                0
                              ).toLocaleString()}
                            </td>
                            <td className="font-xs">
                              {price.effectiveFrom
                                ? new Date(
                                    price.effectiveFrom
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <button
                                  className="status-btn px-5"
                                  style={{
                                    background: "#3182ce",
                                    color: "white",
                                  }}
                                  onClick={() => handleEditPrice(price)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="status-btn px-5"
                                  style={{
                                    background: "#e53e3e",
                                    color: "white",
                                  }}
                                  onClick={() => handleDeletePrice(price.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {selectedHmoForPrices &&
                !loadingAgreedPrices &&
                hmoAgreedPrices.length === 0 && (
                  <div className="m-t-10 font-xs">
                    No agreed prices found for this HMO.
                  </div>
                )}
            </div>

            {/* <div style={{ marginTop: 12 }}>
              <Packages />
            </div> */}
          </div>
        );
      // case "settings":
      //   return (
      //     <div>

      //       <Settings />
      //     </div>
      //   );
      default:
        return null;
    }
  };

  // --- Pricing state and helpers ---
  const [hmoOptions, setHmoOptions] = useState([]);
  const [billableTypeOptions, setBillableTypeOptions] = useState([]);
  const [billableItemOptions, setBillableItemOptions] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [categoryItemList, setCategoryItem] = useState([]);
  const [labServiceList, setLabServiceList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [bedList, setBedList] = useState([]);
  const [selectedHmoForPrices, setSelectedHmoForPrices] = useState("");
  const [hmoAgreedPrices, setHmoAgreedPrices] = useState([]);
  const [loadingAgreedPrices, setLoadingAgreedPrices] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [editFormData, setEditFormData] = useState({
    agreedPrice: "",
    effectiveFrom: "",
    effectiveTo: "",
  });
  const [hmoPricing, setHmoPricing] = useState({
    hmoId: "",
    billableTypeId: "",
    billableItemId: "",
    agreedPrice: "",
    effectiveFrom: "",
    effectiveTo: "",
  });
  const [creatingPricing, setCreatingPricing] = useState(false);

  // Function to fetch billable items from categoryitem endpoint
  const fetchBillableItems = async () => {
    try {
      const response = await get("/categoryitem/list/1/1000");
      const fetchedItemList = response?.resultList || [];
      setItemList(fetchedItemList);

      // setBillableItemOptions(
      //   Array.isArray(fetchedItemList)
      //     ? fetchedItemList.map((item) => ({
      //         label: item.itemName || item.name || item.id,
      //         value: item.id,
      //       }))
      //     : []
      // );
      console.log("Billable items fetched:", fetchedItemList);
    } catch (error) {
      console.error("Error fetching billable items:", error);
      setItemList([]);
      setBillableItemOptions([]);
    }
  };

  // Function to fetch inventory items
  const fetchInventoryItems = async () => {
    try {
      const response = await getPharm("/pharmacyinventory/list/1/1000");
      const fetchedInventoryList = response?.resultList || [];
      setInventoryList(fetchedInventoryList);
      console.log("Inventory items fetched:", fetchedInventoryList);
      return fetchedInventoryList;
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      setInventoryList([]);
      return [];
    }
  };

  // Function to fetch internal lab services
  const fetchInternalLabServices = async () => {
    try {
      const response = await get("/internallabservice/list/1/1000");
      const fetchedLabServiceList = response?.data?.recordList || [];
      setLabServiceList(fetchedLabServiceList);
      console.log("Internal lab services fetched:", fetchedLabServiceList);
      return fetchedLabServiceList;
    } catch (error) {
      console.error("Error fetching internal lab services:", error);
      setLabServiceList([]);
      return [];
    }
  };

  // Function to fetch equipment
  const fetchEquipment = async () => {
    try {
      const response = await get("/equipment/list/1/1000");
      const fetchedEquipmentList = response?.resultList || [];
      setEquipmentList(fetchedEquipmentList);
      console.log("Equipment fetched:", fetchedEquipmentList);
      return fetchedEquipmentList;
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setEquipmentList([]);
      return [];
    }
  };

  // Function to fetch beds
  const fetchBeds = async () => {
    try {
      const response = await get("/bed/list/1/1000");
      const fetchedBedList = response?.resultList || [];
      setBedList(fetchedBedList);
      console.log("Beds fetched:", fetchedBedList);
      return fetchedBedList;
    } catch (error) {
      console.error("Error fetching beds:", error);
      setBedList([]);
      return [];
    }
  };

  // Function to fetch HMO agreed prices
  const fetchHmoAgreedPrices = async (hmoId) => {
    if (!hmoId) {
      setHmoAgreedPrices([]);
      return;
    }

    setLoadingAgreedPrices(true);
    try {
      // Using clinic ID 56 as mentioned in the endpoint pattern
      const response = await gets(
        `/HmoBilling/hmo-agreed-prices/clinic/${localStorage.getItem(
          "clinicId"
        )}/hmo/${hmoId}`
      );
      const agreedPrices = response?.resultList || response || [];
      setHmoAgreedPrices(Array.isArray(agreedPrices) ? agreedPrices : []);
      console.log("HMO agreed prices fetched:", agreedPrices);
    } catch (error) {
      console.error("Error fetching HMO agreed prices:", error);
      setHmoAgreedPrices([]);
    } finally {
      setLoadingAgreedPrices(false);
    }
  };

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
        const bt = await gets("/HmoBilling/billable-types");
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

      // Fetch all data types for dynamic selection
      try {
        await fetchBillableItems();
        await fetchInventoryItems();
        await fetchInternalLabServices();
        await fetchEquipment();
        await fetchBeds();
      } catch (e) {
        console.warn("Failed to fetch some data types", e);
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
      await posts("/HmoBilling/hmo-agreed-prices", payload);
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
      // Refresh the agreed prices list if HMO is selected
      if (selectedHmoForPrices) {
        fetchHmoAgreedPrices(selectedHmoForPrices);
      }
    } catch (err) {
      console.error("Failed to create pricing", err);
      toast.error("Failed to create pricing");
    } finally {
      setCreatingPricing(false);
    }
  };

  const handleEditPrice = (price) => {
    setSelectedPrice(price);
    setEditFormData({
      agreedPrice: price.agreedPrice || "",
      effectiveFrom: price.effectiveFrom
        ? new Date(price.effectiveFrom).toISOString().slice(0, 16)
        : "",
      effectiveTo: price.effectiveTo
        ? new Date(price.effectiveTo).toISOString().slice(0, 16)
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePrice = async () => {
    if (!selectedPrice?.id) {
      toast.error("No price selected");
      return;
    }

    const payload = {
      id: selectedPrice.id,
      hmoId: selectedPrice.hmoId,
      billableTypeId: selectedPrice.billableTypeId,
      billableItemId: selectedPrice.billableItemId,
      agreedPrice: Number(editFormData.agreedPrice) || 0,
      effectiveFrom: editFormData.effectiveFrom
        ? new Date(editFormData.effectiveFrom).toISOString()
        : null,
      effectiveTo: editFormData.effectiveTo
        ? new Date(editFormData.effectiveTo).toISOString()
        : null,
    };

    try {
      setCreatingPricing(true);
      await put(`/HmoBilling/hmo-agreed-prices`, payload);
      toast.success("Pricing updated successfully");
      setIsEditModalOpen(false);
      setSelectedPrice(null);
      // Refresh the agreed prices list
      fetchHmoAgreedPrices(selectedHmoForPrices);
    } catch (err) {
      console.error("Failed to update pricing", err);
      toast.error("Failed to update pricing");
    } finally {
      setCreatingPricing(false);
    }
  };

  const handleDeletePrice = async (priceId) => {
    if (!window.confirm("Are you sure you want to delete this agreed price?")) {
      return;
    }

    try {
      await del(`/HmoBilling/hmo-agreed-prices/${priceId}`);
      toast.success("Pricing deleted successfully");
      // Refresh the agreed prices list
      fetchHmoAgreedPrices(selectedHmoForPrices);
    } catch (err) {
      fetchHmoAgreedPrices(selectedHmoForPrices);

      // console.error("Failed to delete pricing", err);
      // toast.error("Failed to delete pricing");
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <div className="m-t-20 bold-text">HMO/Insurance Management</div>

        <div className="tabs flex m-t-20 bold-text">
          <div
            className={`tab-item ${
              selectedTab === "create-hmo" ? "active" : ""
            }`}
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

          {/* <div
            className={`tab-item ${selectedTab === "settings" ? "active" : ""}`}
            onClick={() => setSelectedTab("settings")}
          >
            Settings
          </div> */}
        </div>

        {renderTabContent()}
      </div>

      {/* Edit Price Modal */}
      {isEditModalOpen && selectedPrice && (
        <div className="overlay">
          <div className="modal-box max-w-600">
            <div className="p-40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="bold-text">Edit HMO Agreed Price</h3>
                <button
                  className="close-btn pointer"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedPrice(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>

              <div className="m-t-20">
                <div className="m-b-15">
                  <p className="font-xs" style={{ color: "#666" }}>
                    <strong>HMO:</strong>{" "}
                    {hmoOptions.find(
                      (hmo) => hmo.value === Number(selectedPrice.hmoId)
                    )?.label || "N/A"}
                  </p>
                  <p className="font-xs m-t-5" style={{ color: "#666" }}>
                    <strong>Item/Service:</strong>{" "}
                    {selectedPrice.billableItemName ||
                      selectedPrice.serviceName ||
                      selectedPrice.name ||
                      "N/A"}
                  </p>
                </div>

                <form className="m-t-20">
                  <div className="flex flex-col gap-3">
                    <InputField
                      label="Agreed Price"
                      value={editFormData.agreedPrice}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          agreedPrice: e.target.value,
                        })
                      }
                      type="number"
                      required
                    />

                    <div>
                      <label className="label">Effective From</label>
                      <input
                        type="datetime-local"
                        className="input-field"
                        value={editFormData.effectiveFrom}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            effectiveFrom: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="label">Effective To</label>
                      <input
                        type="datetime-local"
                        className="input-field"
                        value={editFormData.effectiveTo}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            effectiveTo: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 m-t-20">
                    <button
                      type="button"
                      className="btn w-50"
                      onClick={handleUpdatePrice}
                      disabled={creatingPricing}
                    >
                      {creatingPricing ? "Updating..." : "Update Price"}
                    </button>
                    <button
                      type="button"
                      className="btn w-50"
                      style={{ background: "#6c757d" }}
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setSelectedPrice(null);
                      }}
                      disabled={creatingPricing}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insurance;
