import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import SelectField from "../../UI/SelectField";
import HmoTable from "../../tables/HmoTable";
import Pagination from "../../UI/Pagination"; // Import the Pagination component
import { get, post, put, del } from "../../../utility/fetch";
import toast from "react-hot-toast";

function CreateHmo() {
  // Country codes for SelectField dropdowns
  const countryCodes = [
    { value: "+93", label: "🇦🇫 +93 Afghanistan" },
    { value: "+355", label: "🇦🇱 +355 Albania" },
    { value: "+213", label: "🇩🇿 +213 Algeria" },
    { value: "+376", label: "🇦🇩 +376 Andorra" },
    { value: "+244", label: "🇦🇴 +244 Angola" },
    { value: "+54", label: "🇦🇷 +54 Argentina" },
    { value: "+374", label: "🇦🇲 +374 Armenia" },
    { value: "+61", label: "🇦🇺 +61 Australia" },
    { value: "+43", label: "🇦🇹 +43 Austria" },
    { value: "+994", label: "🇦🇿 +994 Azerbaijan" },
    { value: "+973", label: "🇧🇭 +973 Bahrain" },
    { value: "+880", label: "🇧🇩 +880 Bangladesh" },
    { value: "+375", label: "🇧🇾 +375 Belarus" },
    { value: "+32", label: "🇧🇪 +32 Belgium" },
    { value: "+229", label: "🇧🇯 +229 Benin" },
    { value: "+975", label: "🇧🇹 +975 Bhutan" },
    { value: "+591", label: "🇧🇴 +591 Bolivia" },
    { value: "+387", label: "🇧🇦 +387 Bosnia and Herzegovina" },
    { value: "+267", label: "🇧🇼 +267 Botswana" },
    { value: "+55", label: "🇧🇷 +55 Brazil" },
    { value: "+246", label: "🇮🇴 +246 British Indian Ocean Territory" },
    { value: "+673", label: "🇧🇳 +673 Brunei" },
    { value: "+359", label: "🇧🇬 +359 Bulgaria" },
    { value: "+226", label: "🇧🇫 +226 Burkina Faso" },
    { value: "+257", label: "🇧🇮 +257 Burundi" },
    { value: "+855", label: "🇰🇭 +855 Cambodia" },
    { value: "+237", label: "🇨🇲 +237 Cameroon" },
    { value: "+1", label: "🇨🇦 +1 Canada" },
    { value: "+238", label: "🇨🇻 +238 Cape Verde" },
    { value: "+236", label: "🇨🇫 +236 Central African Republic" },
    { value: "+235", label: "🇹🇩 +235 Chad" },
    { value: "+56", label: "🇨🇱 +56 Chile" },
    { value: "+86", label: "🇨🇳 +86 China" },
    { value: "+57", label: "🇨🇴 +57 Colombia" },
    { value: "+269", label: "🇰🇲 +269 Comoros" },
    { value: "+242", label: "🇨🇬 +242 Republic of the Congo" },
    { value: "+243", label: "🇨🇩 +243 DR Congo" },
    { value: "+506", label: "🇨🇷 +506 Costa Rica" },
    { value: "+225", label: "🇨🇮 +225 Ivory Coast" },
    { value: "+385", label: "🇭🇷 +385 Croatia" },
    { value: "+53", label: "🇨🇺 +53 Cuba" },
    { value: "+357", label: "🇨🇾 +357 Cyprus" },
    { value: "+420", label: "🇨🇿 +420 Czech Republic" },
    { value: "+45", label: "🇩🇰 +45 Denmark" },
    { value: "+253", label: "🇩🇯 +253 Djibouti" },
    { value: "+1", label: "🇺🇸 +1 United States" },
    { value: "+593", label: "🇪🇨 +593 Ecuador" },
    { value: "+20", label: "🇪🇬 +20 Egypt" },
    { value: "+503", label: "🇸🇻 +503 El Salvador" }, // Not in original, but for completeness
    { value: "+240", label: "🇬🇶 +240 Equatorial Guinea" },
    { value: "+291", label: "🇪🇷 +291 Eritrea" }, // Not in original, but for completeness
    { value: "+372", label: "🇪🇪 +372 Estonia" },
    { value: "+251", label: "🇪🇹 +251 Ethiopia" },
    { value: "+298", label: "🇫🇴 +298 Faroe Islands" }, // Not in original, but for completeness
    { value: "+679", label: "🇫🇯 +679 Fiji" }, // Not in original, but for completeness
    { value: "+358", label: "🇫🇮 +358 Finland" },
    { value: "+33", label: "🇫🇷 +33 France" },
    { value: "+241", label: "🇬🇦 +241 Gabon" },
    { value: "+220", label: "🇬🇲 +220 Gambia" },
    { value: "+995", label: "🇬🇪 +995 Georgia" },
    { value: "+49", label: "🇩🇪 +49 Germany" },
    { value: "+233", label: "🇬🇭 +233 Ghana" },
    { value: "+350", label: "🇬🇮 +350 Gibraltar" }, // Not in original, but for completeness
    { value: "+30", label: "🇬🇷 +30 Greece" },
    { value: "+299", label: "🇬🇱 +299 Greenland" }, // Not in original, but for completeness
    { value: "+502", label: "🇬🇹 +502 Guatemala" }, // Not in original, but for completeness
    { value: "+224", label: "🇬🇳 +224 Guinea" },
    { value: "+245", label: "🇬🇼 +245 Guinea-Bissau" },
    { value: "+592", label: "🇬🇾 +592 Guyana" },
    { value: "+509", label: "🇭🇹 +509 Haiti" },
    { value: "+504", label: "🇭🇳 +504 Honduras" },
    { value: "+36", label: "🇭🇺 +36 Hungary" },
    { value: "+354", label: "🇮🇸 +354 Iceland" },
    { value: "+91", label: "🇮🇳 +91 India" },
    { value: "+62", label: "🇮🇩 +62 Indonesia" },
    { value: "+98", label: "🇮🇷 +98 Iran" },
    { value: "+964", label: "🇮🇶 +964 Iraq" },
    { value: "+353", label: "🇮🇪 +353 Ireland" },
    { value: "+972", label: "🇮🇱 +972 Israel" },
    { value: "+39", label: "🇮🇹 +39 Italy" },
    { value: "+225", label: "🇨🇮 +225 Ivory Coast" }, // Duplicate, can be removed
    { value: "+1876", label: "🇯🇲 +1876 Jamaica" }, // Not in original, but for completeness
    { value: "+81", label: "🇯🇵 +81 Japan" },
    { value: "+962", label: "🇯🇴 +962 Jordan" },
    { value: "+7", label: "🇰🇿 +7 Kazakhstan" }, // Not in original, but for completeness
    { value: "+254", label: "🇰🇪 +254 Kenya" },
    { value: "+686", label: "🇰🇮 +686 Kiribati" }, // Not in original, but for completeness
    { value: "+383", label: "🇽🇰 +383 Kosovo" },
    { value: "+965", label: "🇰🇼 +965 Kuwait" },
    { value: "+996", label: "🇰🇬 +996 Kyrgyzstan" },
    { value: "+856", label: "🇱🇦 +856 Laos" },
    { value: "+371", label: "🇱🇻 +371 Latvia" },
    { value: "+961", label: "🇱🇧 +961 Lebanon" },
    { value: "+266", label: "🇱🇸 +266 Lesotho" },
    { value: "+231", label: "🇱🇷 +231 Liberia" },
    { value: "+218", label: "🇱🇾 +218 Libya" },
    { value: "+423", label: "🇱🇮 +423 Liechtenstein" },
    { value: "+370", label: "🇱🇹 +370 Lithuania" },
    { value: "+352", label: "🇱🇺 +352 Luxembourg" },
    { value: "+853", label: "🇲🇴 +853 Macau" },
    { value: "+389", label: "🇲🇰 +389 North Macedonia" },
    { value: "+261", label: "🇲🇬 +261 Madagascar" },
    { value: "+265", label: "🇲🇼 +265 Malawi" },
    { value: "+60", label: "🇲🇾 +60 Malaysia" },
    { value: "+960", label: "🇲🇻 +960 Maldives" },
    { value: "+223", label: "🇲🇱 +223 Mali" },
    { value: "+356", label: "🇲🇹 +356 Malta" },
    { value: "+692", label: "🇲🇭 +692 Marshall Islands" }, // Not in original, but for completeness
    { value: "+222", label: "🇲🇷 +222 Mauritania" },
    { value: "+230", label: "🇲🇺 +230 Mauritius" },
    { value: "+52", label: "🇲🇽 +52 Mexico" },
    { value: "+691", label: "🇫🇲 +691 Micronesia" }, // Not in original, but for completeness
    { value: "+373", label: "🇲🇩 +373 Moldova" },
    { value: "+377", label: "🇲🇨 +377 Monaco" },
    { value: "+976", label: "🇲🇳 +976 Mongolia" },
    { value: "+382", label: "🇲🇪 +382 Montenegro" },
    { value: "+212", label: "🇲🇦 +212 Morocco" },
    { value: "+258", label: "🇲🇿 +258 Mozambique" },
    { value: "+95", label: "🇲🇲 +95 Myanmar" },
    { value: "+264", label: "🇳🇦 +264 Namibia" },
    { value: "+674", label: "🇳🇷 +674 Nauru" }, // Not in original, but for completeness
    { value: "+977", label: "🇳🇵 +977 Nepal" },
    { value: "+31", label: "🇳🇱 +31 Netherlands" },
    { value: "+64", label: "🇳🇿 +64 New Zealand" },
    { value: "+505", label: "🇳🇮 +505 Nicaragua" },
    { value: "+227", label: "🇳🇪 +227 Niger" },
    { value: "+234", label: "🇳🇬 +234 Nigeria" },
    { value: "+47", label: "🇳🇴 +47 Norway" },
    { value: "+968", label: "🇴🇲 +968 Oman" },
    { value: "+92", label: "🇵🇰 +92 Pakistan" },
    { value: "+680", label: "🇵🇼 +680 Palau" }, // Not in original, but for completeness
    { value: "+970", label: "🇵🇸 +970 Palestine" },
    { value: "+507", label: "🇵🇦 +507 Panama" },
    { value: "+675", label: "🇵🇬 +675 Papua New Guinea" }, // Not in original, but for completeness
    { value: "+595", label: "🇵🇾 +595 Paraguay" },
    { value: "+51", label: "🇵🇪 +51 Peru" },
    { value: "+63", label: "🇵🇭 +63 Philippines" },
    { value: "+48", label: "🇵🇱 +48 Poland" },
    { value: "+351", label: "🇵🇹 +351 Portugal" },
    { value: "+974", label: "🇶🇦 +974 Qatar" },
    { value: "+40", label: "🇷🇴 +40 Romania" },
    { value: "+7", label: "🇷🇺 +7 Russia" },
    { value: "+250", label: "🇷🇼 +250 Rwanda" },
    { value: "+590", label: "🇬🇵 +590 Saint Barthelemy" }, // Not in original, but for completeness
    { value: "+290", label: "🇸🇭 +290 Saint Helena" }, // Not in original, but for completeness
    { value: "+1869", label: "🇰🇳 +1869 Saint Kitts and Nevis" }, // Not in original, but for completeness
    { value: "+1758", label: "🇱🇨 +1758 Saint Lucia" }, // Not in original, but for completeness
    { value: "+508", label: "🇵🇲 +508 Saint Pierre and Miquelon" }, // Not in original, but for completeness
    { value: "+1784", label: "🇻🇨 +1784 Saint Vincent and the Grenadines" }, // Not in original, but for completeness
    { value: "+685", label: "🇼🇸 +685 Samoa" }, // Not in original, but for completeness
    { value: "+378", label: "🇸🇲 +378 San Marino" },
    { value: "+239", label: "🇸🇹 +239 Sao Tome and Principe" },
    { value: "+966", label: "🇸🇦 +966 Saudi Arabia" },
    { value: "+221", label: "🇸🇳 +221 Senegal" },
    { value: "+381", label: "🇷🇸 +381 Serbia" },
    { value: "+248", label: "🇸🇨 +248 Seychelles" },
    { value: "+232", label: "🇸🇱 +232 Sierra Leone" },
    { value: "+65", label: "🇸🇬 +65 Singapore" },
    { value: "+421", label: "🇸🇰 +421 Slovakia" },
    { value: "+386", label: "🇸🇮 +386 Slovenia" },
    { value: "+677", label: "🇸🇧 +677 Solomon Islands" }, // Not in original, but for completeness
    { value: "+252", label: "🇸🇴 +252 Somalia" },
    { value: "+27", label: "🇿🇦 +27 South Africa" },
    { value: "+82", label: "🇰🇷 +82 South Korea" },
    { value: "+211", label: "🇸🇸 +211 South Sudan" }, // Not in original, but for completeness
    { value: "+34", label: "🇪🇸 +34 Spain" },
    { value: "+94", label: "🇱🇰 +94 Sri Lanka" },
    { value: "+249", label: "🇸🇩 +249 Sudan" },
    { value: "+597", label: "🇸🇷 +597 Suriname" }, // Not in original, but for completeness
    { value: "+268", label: "🇸🇿 +268 Eswatini" },
    { value: "+46", label: "🇸🇪 +46 Sweden" },
    { value: "+41", label: "🇨🇭 +41 Switzerland" },
    { value: "+963", label: "🇸🇾 +963 Syria" },
    { value: "+886", label: "🇹🇼 +886 Taiwan" },
    { value: "+992", label: "🇹🇯 +992 Tajikistan" },
    { value: "+255", label: "🇹🇿 +255 Tanzania" },
    { value: "+66", label: "🇹🇭 +66 Thailand" },
    { value: "+228", label: "🇹🇬 +228 Togo" },
    { value: "+676", label: "🇹🇴 +676 Tonga" }, // Not in original, but for completeness
    { value: "+216", label: "🇹🇳 +216 Tunisia" },
    { value: "+90", label: "🇹🇷 +90 Turkey" },
    { value: "+993", label: "🇹🇲 +993 Turkmenistan" },
    { value: "+688", label: "🇹🇻 +688 Tuvalu" }, // Not in original, but for completeness
    { value: "+256", label: "🇺🇬 +256 Uganda" },
    { value: "+380", label: "🇺🇦 +380 Ukraine" },
    { value: "+971", label: "🇦🇪 +971 United Arab Emirates" },
    { value: "+44", label: "🇬🇧 +44 United Kingdom" },
    { value: "+1", label: "🇺🇸 +1 United States" }, // Duplicate, can be removed
    { value: "+598", label: "🇺🇾 +598 Uruguay" },
    { value: "+998", label: "🇺🇿 +998 Uzbekistan" },
    { value: "+678", label: "🇻🇺 +678 Vanuatu" }, // Not in original, but for completeness
    { value: "+58", label: "🇻🇪 +58 Venezuela" },
    { value: "+84", label: "🇻🇳 +84 Vietnam" },
    { value: "+681", label: "🇼🇫 +681 Wallis and Futuna" }, // Not in original, but for completeness
    { value: "+967", label: "🇾🇪 +967 Yemen" },
    { value: "+260", label: "🇿🇲 +260 Zambia" },
    { value: "+263", label: "🇿🇼 +263 Zimbabwe" },
  ];
  const [countryCode, setCountryCode] = useState("+234");
  const [altCountryCode, setAltCountryCode] = useState("+234");
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
  const [editingHmoId, setEditingHmoId] = useState(null);

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

  // Handle edit - populate form with HMO data
  const handleEditHmo = (hmo) => {
    setEditingHmoId(hmo.id);
    setVendorName(hmo.vendorName || "");
    setPhoneNumber(hmo.phoneNumber || "");
    setAltPhoneNumber(hmo.altPhoneNumber || "");
    setEmailAddress(hmo.email || "");
    setContactPerson(hmo.contactPerson || "");
    setRcNumber(hmo.rcNumber || "");
    setTaxIdentityNumber(hmo.taxIdentityNumber || "");
    setOfficeAddress(hmo.officeAddress || "");
  };

  // Handle update HMO
  const handleUpdateHmo = async () => {
    if (!editingHmoId) return;

    setIsLoading(true);
    const payload = {
      vendorName: vendorName,
      phoneNumber: phoneNumber,
      altPhoneNumber: altPhoneNumber,
      contactPerson: contactPerson,
      rcNumber: rcNumber,
      taxIdentityNumber: taxIdentityNumber,
    };

    // Clear previous errors
    setVendorNameError(null);
    setPhoneNumberError(null);
    setContactPersonError(null);
    setRcNumberError(null);
    setTaxIdentityNumberError(null);
    setAltPhoneNumberError(null);

    try {
      await put(`/hmo/${editingHmoId}`, payload);
      toast.success("HMO Updated Successfully");
      fetchData(currentPage, pageSize);
      clearForm();
    } catch (e) {
      console.error("Error updating HMO: ", e);

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
          } else if (
            errorMessage.includes("altPhoneNumber") ||
            errorMessage.toLowerCase().includes("alt")
          ) {
            setAltPhoneNumberError("Invalid alternate phone number.");
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

  // Handle delete HMO
  const handleDeleteHmo = async (hmoId) => {
    if (!window.confirm("Are you sure you want to delete this HMO?")) {
      return;
    }

    setIsLoading(true);
    try {
      await del(`/hmo/${hmoId}`);
      toast.success("HMO Deleted Successfully");
      fetchData(currentPage, pageSize);
    } catch (e) {
      console.error("Error deleting HMO: ", e);
      toast.error("Failed to delete HMO");
    }
    setIsLoading(false);
  };

  // Clear form
  const clearForm = () => {
    setEditingHmoId(null);
    setVendorName("");
    setPhoneNumber("");
    setAltPhoneNumber("");
    setEmailAddress("");
    setContactPerson("");
    setRcNumber("");
    setTaxIdentityNumber("");
    setOfficeAddress("");
    setVendorNameError(null);
    setPhoneNumberError(null);
    setEmailAddressError(null);
    setContactPersonError(null);
    setRcNumberError(null);
    setTaxIdentityNumberError(null);
    setAltPhoneNumberError(null);
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
          label="HMO's Name"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
        />
        {vendorNameError && (
          <span className="error-message">{vendorNameError}</span>
        )}

        <div className="m-t-20">
          <div className=" gap-10">
            <SelectField
              name="Country Code"
              label="Country Code"
              options={countryCodes}
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <InputField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          {phoneNumberError && (
            <span className="error-message">{phoneNumberError}</span>
          )}
        </div>

        <div className="m-t-20">
          <div className=" gap-10">
            <SelectField
              name="Alt Country Code"
              label="Alt Country Code"
              options={countryCodes}
              value={altCountryCode}
              onChange={(e) => setAltCountryCode(e.target.value)}
            />
            <InputField
              label="Alt Phone Number"
              value={altPhoneNumber}
              onChange={(e) => setAltPhoneNumber(e.target.value)}
              placeholder="Enter alternate phone number"
            />
          </div>
          {altPhoneNumberError && (
            <span className="error-message">{altPhoneNumberError}</span>
          )}
        </div>

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

        <div className="flex gap-10">
          <button
            className="btn m-t-20 flex flex-h-center w-100"
            onClick={editingHmoId ? handleUpdateHmo : handleCreateHmo}
            disabled={isLoading}
          >
            {editingHmoId ? "Update HMO" : "Create HMO"}
          </button>
          {editingHmoId && (
            <button
              className="btn m-t-20 flex flex-h-center w-100"
              onClick={clearForm}
              disabled={isLoading}
              style={{ backgroundColor: "#f0ad4e" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>
      <div className="w-100">
        <HmoTable
          data={hmoData}
          isloading={loading}
          onActionClick={handleAddPackage}
          currentPage={currentPage}
          pageSize={pageSize}
          onEdit={handleEditHmo}
          onDelete={handleDeleteHmo}
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
