import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import CreateHmo from "./insurance-hmo/CreateHmo";
import HmoProfile from "./insurance-hmo/HmoProfile";
import Packages from "./insurance-hmo/Packages";
import Settings from "./insurance-hmo/Settings";

function Insurance() {
  // Sample data with a patient's name
  const [selectedTab, setSelectedTab] = useState("create-hmo");
  const [newData, setNewData] = useState([])
  const [available, setAvailable] = useState(0);
  const [occupied, setOccupied] = useState(0);


  const data = [
    {
      patientName: "William Humphrey",
      InsuranceId: "A1",
      occupied: true,
    },


  ];

  const fetchData = async () => {
    try {
      const response = await get(`/insurance/create-hmo`)

      setNewData(response)
      calculateOccupied(response);
      calculateAvailable(response);

    } catch (e) {
      console.log(e)
    }

  }

  const calculateOccupied = (data) => {
    const occupied = data.filter((item) => item.isOccupied === "Occupied").length
    setOccupied(occupied)
  }

  const calculateAvailable = (data) => {
    const available = data.filter((item) => item.isOccupied === "Vacant").length
    setAvailable(available)
  }




  useEffect(() => {
    fetchData();
  }, [])

  const renderTabContent = () => {
    switch (selectedTab) {
      case "create-hmo":
        return (
          <div>
            <CreateHmo />
          </div>
        );
      case "hmo-profile":

        return <div><HmoProfile /></div>;
      case "packages":

        return <div><Packages /></div>;
      case "settings":
        return <div><Settings /></div>;
      default:
        return null;
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


        {/* <div
          className={`tab-item ${selectedTab === "settings" ? "active" : ""}`}
          onClick={() => setSelectedTab("settings")}
        >
          Categories
        </div> */}
      </div>




      {renderTabContent()}
    </div>
  );
}

export default Insurance;
