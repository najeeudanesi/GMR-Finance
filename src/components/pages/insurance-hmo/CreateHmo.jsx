import React, { useEffect, useState } from 'react';
import InputField from '../../UI/InputField';
import HmoTable from '../../tables/HmoTable';
import Pagination from '../../UI/Pagination'; // Import the Pagination component
import { get, post } from '../../../utility/fetch';
import toast from 'react-hot-toast';

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

    const [vendorNameError, setVendorNameError] = useState(null);
    const [phoneNumberError, setPhoneNumberError] = useState(null);
    const [emailAddressError, setEmailAddressError] = useState(null);

    const userId = localStorage.getItem('userId');

    const fetchData = async (page, size) => {
        setLoading(true);
        try {
            const data = await get(`/hmo/list/${page}/${size}`);
            setHmoData(data.resultList); // Adjust this based on the actual response structure
            setTotalPages(data.totalPages); // Set total pages from response
        } catch (e) {
            console.error("Error fetching HMO data: ", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

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
            email: emailAddress
        };

        // Clear previous errors
        setVendorNameError(null);
        setPhoneNumberError(null);
        setEmailAddressError(null);

        try {
            const response = await post('/hmo', payload);
            toast.success("HMO Created Successfully");
            fetchData(currentPage, pageSize); // Refresh the data
            // Clear input fields after successful creation (if needed)
            setVendorName("");
            setPhoneNumber("");
            setEmailAddress("");
        } catch (e) {
            console.error("Error creating HMO: ", e);

            const errorData = await e.response.json();
            console.error("Error data: ", errorData);

            if (Array.isArray(errorData?.errorData)) {
                errorData.errorData.forEach(errorMessage => {
                    if (errorMessage.includes("Vendor Name")) {
                        setVendorNameError("Vendor Name should be between 10 and 200 characters.");
                    } else if (errorMessage.includes("phone number")) {
                        setPhoneNumberError("Invalid phone number. It must start with a dial code '+' followed by 1-3 digits and then 10-14 digits for the phone number.");
                    } else if (errorMessage.includes("email address")) {
                        setEmailAddressError("Invalid email address.");
                    } else {
                        toast.error("Error Occurred: " + errorMessage);
                    }
                });
            } else if (typeof errorData === 'string') {
                toast.error("Error Occurred: " + errorData);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
        setIsLoading(false);
    };

    return (
        <div className='flex gap-10'>
            <div className='w-40'>
                <InputField label="Vendor's Name" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />

                {vendorNameError && <span className="error-message">{vendorNameError}</span>}
                <InputField label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                {phoneNumberError && <span className="error-message">{phoneNumberError}</span>}
                <InputField label="Email Address" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                {emailAddressError && <span className="error-message">{emailAddressError}</span>}
                <button className='btn m-t-20 flex flex-h-center w-100' onClick={handleCreateHmo} disabled={isLoading}>Create HMO</button>
            </div>
            <div className='w-60'>
                <HmoTable data={hmoData} loading={loading} />
                <div className='flex flex-h-end m-t-20'>
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
