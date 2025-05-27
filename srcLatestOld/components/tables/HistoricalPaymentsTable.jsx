import React, { useEffect, useState } from "react";
import ImmunizationAttachment from "../modals/ImmunizationAttachments";
import { formatDate } from "../../utility/general";
import { get } from "../../utility/fetch";
import toast from "react-hot-toast";

function HistoricalPaymentsTable({ patientId }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [data, setData] = useState([]);
    const [isloading, setIsLoading] = useState(false)

    const downloadFile = async (docName) => {
        try {
            // Get the token from local storage
            const token = sessionStorage.getItem('token').split('Bearer ')[1];

            // If token is not available, handle accordingly
            if (!token) {
                console.error('Token not found in session storage');
                return null;
            }

            // Construct the URL with the document name
            const url = `https://edogoverp.com/labapi/api/document/download-document/${docName}`;

            // Fetch options including the Authorization header with the JWT token
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Fetch the file
            const response = await fetch(url, options);

            // Check if the request was successful
            if (response.ok) {
                // Convert response body to a blob
                const blob = await response.blob();

                // Create a URL for the blob
                const blobUrl = URL.createObjectURL(blob);

                // Trigger download by creating an anchor element
                const anchor = document.createElement('a');
                anchor.href = blobUrl;
                anchor.download = docName; // Set the filename for download
                anchor.click();

                // Clean up by revoking the blob URL
                URL.revokeObjectURL(blobUrl);
            } else {
                toast.error('Failed to Download/ Invalid Document')
                console.error('Failed to fetch download link:', response.statusText);
            }
        } catch (e) {
            console.error('Error fetching download link:', e);
        }
    };

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const response = await get(`/patientpayment/${patientId}`);

            setData([response]);
        } catch (e) {
            console.log(e);
        }

        setIsLoading(false)
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const stageAttachments = (data) => {
        setAttachments(data);
        toggleModal();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-100 ">
            {
                !isloading ? (<div className="w-100 none-flex-item m-t-40">
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-10">Date</th>
                                <th>Diagnosis</th>
                                <th className="w-50" >Payment Breakdown</th>
                                <th>Deposit</th>
                                <th>Balance</th>

                            </tr>
                        </thead>
                        <tbody className="white-bg view-det-pane">
                            {data.map((row) => (
                                <tr key={row.id}>
                                    <td>{formatDate(row?.createdOn)}</td>
                                    <td>{row?.diagnosis}</td>
                                    <td className="font-xs">
                                        {row?.paymentBreakdowns && (
                                            <div>
                                                <table className="w-100 no-bordered-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Items</th>
                                                            <th>Category</th>
                                                            <th>Cost</th>
                                                            <th>HMO Cover</th>
                                                            <th>Due Pay</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {row?.paymentBreakdowns.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item?.itemName}</td>
                                                                <td>{item?.category.name}</td>
                                                                <td>{item?.cost}</td>
                                                                <td>{item?.hmoCover}</td>
                                                                <td>{item?.duePay}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div>

                                                </div>
                                            </div>

                                        )}
                                    </td>
                                    <td>{row?.hmoDeposit}</td>
                                    <td>{row?.hmoBalance}</td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>) : (<div>Loading....</div>)
            }

            {modalOpen && <ImmunizationAttachment closeModal={toggleModal} data={attachments} />}
        </div>
    );
}

export default HistoricalPaymentsTable;
