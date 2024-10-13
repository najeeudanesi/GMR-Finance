import React, { useState } from "react";
import InventoryTable from "../tables/InventoryTable";
import ThresholdItemTable from "../tables/ThresholdItemTable";
import UpdateInventory from "./Patient/UpdateInentory";

function ManageInventory() {
  const [searchText, setSearchText] = useState("");

    const [selectedTab, setSelectedTab] = useState("create-hmo");

    const handleSearchChange = (event) => {
        console.log('evevt');
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case "inventory":
                return (
                    <div>
                        <InventoryTable />
                    </div>
                );
            case "thresholdItems":

                return <div><ThresholdItemTable /></div>;
            case "updateInventory":

                return <div><UpdateInventory /></div>;
            default:
                return (
                    <div>
                        <InventoryTable />
                    </div>
                );
        }
    };

  return (
    <div className="w-100">
      <div className="m-t-20">...</div>
      <div className="flex justify-between">
        <div className="m-t-20 bold-text">Manage Inventory</div>
        <div className="h-20 w-40 pt-3">
          <SearchInput
            type="text"
            onChange={handleSearchChange}
            value={searchText}
            name="searchText"
          />
        </div>
      </div>
      <div className="tabs flex m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "create-hmo" ? "active" : ""}`}
          onClick={() => setSelectedTab("inventory")}
        >
          Inventory
        </div>
        <div
          className={`tab-item ${selectedTab === "settings" ? "active" : ""}`}
          onClick={() => setSelectedTab("addInventory")}
        >
          Add New Inventory
        </div>

        <div
          className={`tab-item ${selectedTab === "settings" ? "active" : ""}`}
          onClick={() => setSelectedTab("thresholdItems")}
        >
          Threshold Items
        </div>
        <div
          className={`tab-item ${selectedTab === "settings" ? "active" : ""}`}
          onClick={() => setSelectedTab("updateInventory")}
        >
          Update Inventory
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
}

export default ManageInventory;
