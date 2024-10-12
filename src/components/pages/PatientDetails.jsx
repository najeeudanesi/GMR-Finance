import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import { useParams } from "react-router-dom";
import InputField from "../UI/InputField";
import Personal from "./Patient/Personal";
import ContactDetails from "./Patient/ContactDetails";
import SearchInput from "../UI/SearchInput";
import Membership from "./Patient/Membership";
import downloadImg from "../../assets/images/download.png";
import toast from "react-hot-toast";

function PatientDetails() {
  const [selectedTab, setSelectedTab] = useState("personal");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { patientId } = useParams();
  const [searchText, setSearchText] = useState("");
  const [hmoClass, setHmoClass] = useState("");

  const switchToTab = (tab) => {
    setSelectedTab(tab);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  
  const getPatientHmoDetails = async () => {
    try {
      const data = await get(`/patientpayment/${patientId}`);
      setHmoClass(data.paymentBreakdowns[0].hmoClass);
      // console.log(data);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch patient details");
    }
  };
  const getPatientDetails = async () => {
    setLoading(true);
    try {
      const data = await get(`/patient/${patientId}`);
      setPatient(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPatientDetails();
    getPatientHmoDetails();
  }, []);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "personal":
        return (
          <div>
            <Personal data={patient} />
          </div>
        );
      case "contactDetails":
        return (
          <div>
            <ContactDetails data={patient} />
          </div>
        );
      case "identityDetails":
        return <div>Treatment Details Placeholder</div>;
      case "membershipCoverage":
        return (
          <div>
            <Membership />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-40">
        {loading ? (
          <div className="m-t-10">Loading...</div>
        ) : (
          <div className="m-t-40 w-100 flex-col">
            <div className="w-full mt-5 underline-container flex items-center justify-between py-4">
              <h2 className="text-xl font-semibold">
                Patient Health Insurance (HMO) Details
              </h2>
              <div className="flex items-center space-x-4">
                <SearchInput
                  type="text"
                  onChange={handleSearchChange}
                  value={searchText}
                  name="searchText"
                  className="w-64"
                />
                <div className="w-13 h-13 rounded-full bg-green-300 flex items-center justify-center p-1 border-2 border-green-500">
                  <img
                    src={downloadImg}
                    alt="Download"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between w-100 m-t-40">
              <div className="flex flex-v-center gap-8 w-60">
                <img
                  src={
                    patient?.pictureUrl ||
                    `https://cdn-icons-png.freepik.com/512/14026/14026766.png`
                  }
                  alt="Profile Image"
                  height={150}
                  width={150}
                />
                <div className="flex flex-col gap-9">
                  <div className="flex flex-v-center gap-6">
                    <p className="bold-text">Patient Name:</p>
                    <p>
                      {patient?.firstName} {patient?.lastName}
                    </p>
                  </div>
                  <div className="flex flex-v-center gap-6">
                    <p className="bold-text">Patient #ID:</p>
                    <p>{patient?.id}</p>
                  </div>
                  <div className="flex flex-v-center gap-6">
                    <p className="bold-text">Visit Date:</p>
                    <p>
                      {patient?.visitStartedOn} -{" "}
                      {patient?.visitEndedOn || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-30">
                <InputField label={"HMO class"} disabled={true}
                  value={hmoClass || "n/a"}
                />
                <InputField label={"Validity"} disabled={true} 
                 value={patient.validity || "n/a"}
                />
              </div>
            </div>
            <div className="w-100 flex justify-start m-t-20">
              <div className="w-30">
                <InputField label={"HMO Service Provider"} disabled={true} 
                 value={patient.serviceProvider || "n/a"}
                />
              </div>
            </div>
            <div className="tabs flex m-t-20 bold-text w-100">
              <div
                className={`tab-item ${selectedTab === "personal" ? "active" : ""
                  }`}
                onClick={() => switchToTab("personal")}
              >
                Personal
              </div>
              <div
                className={`tab-item ${selectedTab === "contactDetails" ? "active" : ""
                  }`}
                onClick={() => switchToTab("contactDetails")}
              >
                Contact Details
              </div>

            </div>
            <div className="w-100 p-x-20">{renderTabContent()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;