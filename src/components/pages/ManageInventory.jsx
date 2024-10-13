import React, { useState } from "react";
import InventoryTable from "../tables/InventoryTable";
import ThresholdItemTable from "../tables/ThresholdItemTable";
import AddInventory from "./Patient/AddInentory";

function ManageInventory() {

    const [selectedTab, setSelectedTab] = useState("create-hmo");
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
            case "addInventory":

                return <div><AddInventory /></div>;
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
                    onClick={() => setSelectedTab("thresholdItems")}
                >
                    Threshold Items
                </div>
                <div
                    className={`tab-item ${selectedTab === "settings" ? "active" : ""}`}
                    onClick={() => setSelectedTab("addInventory")}
                >
                    Add Inventory
                </div>
            </div>




            {renderTabContent()}
        </div>
    );
}

export default ManageInventory;
