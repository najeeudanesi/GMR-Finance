import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import HmoTable from "../../tables/HmoTable";
import Pagination from "../../UI/Pagination"; // Import the Pagination component
import { get, post } from "../../../utility/fetch";
import toast from "react-hot-toast";

function CreateHmo() {
  const [hmoData, setHmoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [vendorName, setVendorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [taxIdentityNumber, setTaxIdentityNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [lga, setLga] = useState("");
  const [city, setCity] = useState("");
  const [altPhoneNumber, setAltPhoneNumber] = useState("");
  const [hmoOptions, setHmoOptions] = useState([]);
  const [selectedHmoId, setSelectedHmoId] = useState("");

  const [vendorNameError, setVendorNameError] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [emailAddressError, setEmailAddressError] = useState(null);
  const [contactPersonError, setContactPersonError] = useState(null);
  const [rcNumberError, setRcNumberError] = useState(null);
  const [taxIdentityNumberError, setTaxIdentityNumberError] = useState(null);
  const [officeAddressError, setOfficeAddressError] = useState(null);
  const [countryIdError, setCountryIdError] = useState(null);
  const [stateIdError, setStateIdError] = useState(null);
  const [lgaError, setLgaError] = useState(null);
  const [cityError, setCityError] = useState(null);
  const [altPhoneNumberError, setAltPhoneNumberError] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchData = async (page, size) => {
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

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Handler when AddPackageModal returns a package name for a row
  const handleAddPackage = async (row, packageName) => {
    if (!row || !packageName) return;
    try {
      setIsLoading(true);
      const payload = {
        name: packageName,
        // userId: Number(userId) || 0,
      };
      // Assumption: API endpoint to add package for an HMO is POST /hmo/{id}/package
      // If your API differs, update the path accordingly.
      await post(`/hmo/${row.id}/add-package`, payload);
      toast.success(`Package '${packageName}' added to ${row.vendorName}`);
      fetchData(currentPage, pageSize);
    } catch (err) {
      console.error("Error adding package:", err);
      toast.error("Failed to add package");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch HMO options for dropdown (uses the provided HMO schema)
  useEffect(() => {
    const fetchHmoOptions = async () => {
      try {
        const res = await get("/hmo/list/1/100");
        // API may return { resultList: [...] } or an array directly
        const list = res?.resultList || res || [];
        const arr = Array.isArray(list) ? list : [];
        const options = arr.map((h) => ({
          label: h.vendorName,
          value: h.id,
          raw: h,
        }));
        setHmoOptions(options);
      } catch (e) {
        console.error("Error fetching HMO options", e);
      }
    };
    fetchHmoOptions();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateHmo = async () => {
    setIsLoading(true);
    const userIdInt = parseInt(userId, 10);
    const payload = {
      userId: userIdInt,
      vendorName: vendorName,
      phoneNumber: phoneNumber,
      altPhoneNumber: altPhoneNumber,
      email: emailAddress,
      contactPerson: contactPerson,
      rcNumber: rcNumber,
      taxIdentityNumber: taxIdentityNumber,
      officeAddress: officeAddress,
      countryId: Number(1) || 0,
      stateId: Number(1) || 0,
      lga: "Orokamu",
      city: "Orokamu",
    };

    // Clear previous errors
    setVendorNameError(null);
    setPhoneNumberError(null);
    setEmailAddressError(null);

    try {
      await post("/hmo", payload);
      toast.success("HMO Created Successfully");
      fetchData(currentPage, pageSize); // Refresh the data
      // Clear input fields after successful creation
      // setVendorName("");
      // setPhoneNumber("");
      // setEmailAddress("");
      // setContactPerson("");
      // setRcNumber("");
      // setTaxIdentityNumber("");
      // setOfficeAddress("");
      // setCountryId(0);
      // setStateId(0);
      // setLga("");
      // setCity("");
      // setAltPhoneNumber("");
    } catch (e) {
      console.error("Error creating HMO: ", e);

      const errorData = await e.response.json();
      console.error("Error data: ", errorData);

      if (Array.isArray(errorData?.errorData)) {
        errorData.errorData.forEach((errorMessage) => {
          if (errorMessage.includes("Vendor Name")) {
            setVendorNameError(
              "Vendor Name should be between 10 and 200 characters."
            );
          } else if (errorMessage.includes("phone number")) {
            setPhoneNumberError(
              "Invalid phone number. It must start with a dial code '+' followed by 1-3 digits and then 10-14 digits for the phone number."
            );
          } else if (errorMessage.includes("email address")) {
            setEmailAddressError("Invalid email address.");
          } else if (
            errorMessage.includes("contactPerson") ||
            errorMessage.toLowerCase().includes("contact")
          ) {
            setContactPersonError("Invalid contact person.");
          } else if (
            errorMessage.includes("rcNumber") ||
            errorMessage.toLowerCase().includes("rc")
          ) {
            setRcNumberError("Invalid RC number.");
          } else if (
            errorMessage.includes("taxIdentityNumber") ||
            errorMessage.toLowerCase().includes("tax")
          ) {
            setTaxIdentityNumberError("Invalid tax identity number.");
          } else {
            toast.error("Error Occurred: " + errorMessage);
          }
        });
      } else if (typeof errorData === "string") {
        toast.error("Error Occurred: " + errorData);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-10">
      <div className="w-40">
        <InputField
          label="Vendor's Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />
        {vendorNameError && (
          <span className="error-message">{vendorNameError}</span>
        )}

        <InputField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {phoneNumberError && (
          <span className="error-message">{phoneNumberError}</span>
        )}

        <InputField
          label="Alt Phone Number"
          value={altPhoneNumber}
          onChange={(e) => setAltPhoneNumber(e.target.value)}
        />
        {altPhoneNumberError && (
          <span className="error-message">{altPhoneNumberError}</span>
        )}

        <InputField
          label="Email Address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
        />
        {emailAddressError && (
          <span className="error-message">{emailAddressError}</span>
        )}

        <InputField
          label="Contact Person"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />
        {contactPersonError && (
          <span className="error-message">{contactPersonError}</span>
        )}

        <InputField
          label="RC Number"
          value={rcNumber}
          onChange={(e) => setRcNumber(e.target.value)}
        />
        {rcNumberError && (
          <span className="error-message">{rcNumberError}</span>
        )}

        <InputField
          label="Tax Identity Number"
          value={taxIdentityNumber}
          onChange={(e) => setTaxIdentityNumber(e.target.value)}
        />
        {taxIdentityNumberError && (
          <span className="error-message">{taxIdentityNumberError}</span>
        )}

        <InputField
          label="Office Address"
          value={officeAddress}
          onChange={(e) => setOfficeAddress(e.target.value)}
        />
        {officeAddressError && (
          <span className="error-message">{officeAddressError}</span>
        )}

        {/* <InputField
          label="Country ID"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
        />
        {countryIdError && (
          <span className="error-message">{countryIdError}</span>
        )}

        <InputField
          label="State ID"
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
        />
        {stateIdError && <span className="error-message">{stateIdError}</span>} */}

        {/* <InputField
          label="LGA"
          value={lga}
          onChange={(e) => setLga(e.target.value)}
        />
        {lgaError && <span className="error-message">{lgaError}</span>}

        <InputField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {cityError && <span className="error-message">{cityError}</span>} */}

        <button
          className="btn m-t-20 flex flex-h-center w-100"
          onClick={handleCreateHmo}
          disabled={isLoading}
        >
          Create HMO
        </button>
      </div>
      <div className="w-60">
        <HmoTable
          data={hmoData}
          isloading={loading}
          onActionClick={handleAddPackage}
        />
        <div className="flex flex-h-end m-t-20">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateHmo;
