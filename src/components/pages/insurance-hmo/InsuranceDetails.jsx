import React, { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import HmoProfile from "./HmoProfile";
import Packages from "./Packages";
import { BsArrowLeft, BsBack } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "../../UI/Pagination";

function InsuranceDetails() {
    // Sample data with a patient's name
    const [selectedTab, setSelectedTab] = useState("hmo-profile");
    const [newData, setNewData] = useState([])
    const [packages, setPackages] = useState([])
    const [available, setAvailable] = useState(0);
    const [occupied, setOccupied] = useState(0);

    const navigate = useNavigate();

    const { insuranceId } = useParams();
    const fetchData = async () => {
        try {
            const response = await get(`/hmo/${insuranceId}`)

            setNewData(response)
            console.log(response)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const renderTabContent = () => {
        switch (selectedTab) {
            case "hmo-profile":

                return <div><HmoProfile data={newData} id={insuranceId} />


                </div>;
            case "packages":

                return <div><Packages data={newData?.packages || []} id={insuranceId} fetchData={fetchData} /></div>;

            default:
                return null;
        }
    };

    return (
        <div className="w-100">
            <div className="m-t-20">...</div>
            <div className="m-t-20 bold-text pointer" onClick={() => navigate(-1)}><BsArrowLeft />  {newData?.vendorName} </div>

            <div className="tabs flex m-t-20 bold-text">


                <div
                    className={`tab-item ${selectedTab === "hmo-profile" ? "active" : ""}`}
                    onClick={() => setSelectedTab("hmo-profile")}
                >
                    Hmo Profile Details
                </div>

                <div
                    className={`tab-item ${selectedTab === "packages" ? "active" : ""}`}
                    onClick={() => setSelectedTab("packages")}
                >
                    Packages
                </div>

            </div>




            {renderTabContent()}
        </div>
    );
}

export default InsuranceDetails;
