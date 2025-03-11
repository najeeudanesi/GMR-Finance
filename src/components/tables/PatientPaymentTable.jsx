import React, { useEffect, useState } from "react";
import ImmunizationAttachment from "../modals/ImmunizationAttachments";
import { formatDate } from "../../utility/general";
import { get } from "../../utility/fetch";
import toast from "react-hot-toast";
import UpdateModal from "../modals/UpdateModal";

function PatientPaymentTable({ patientId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [data, setData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [paymentBreakdownData, setPaymentBreakdownData] = useState(null);
  const [paywithWallet, setPaywithWallet] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    amountPayableBy: "",
    amountOwned: "",
    amountPaid: "",
    availableBalance: "",
    comment: "",
  });
  const [paid, setpaid] = useState(0);


  const downloadFile = async (docName) => {
    try {
      // Get the token from local storage
      const token = sessionStorage.getItem("token").split("Bearer ")[1];

      // If token is not available, handle accordingly
      if (!token) {
        console.error("Token not found in session storage");
        return null;
      }

      // Construct the URL with the document name
      const url = `https://edogoverp.com/labapi/api/document/download-document/${docName}`;

      // Fetch options including the Authorization header with the JWT token
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = docName; // Set the filename for download
        anchor.click();

        // Clean up by revoking the blob URL
        URL.revokeObjectURL(blobUrl);
      } else {
        toast.error("Failed to Download/ Invalid Document");
        console.error("Failed to fetch download link:", response.statusText);
      }
    } catch (e) {
      console.error("Error fetching download link:", e);
    }
  };

  const handleUpdateModalOpen = (data) => {
    console.log(data);
    setIsUpdateModalOpen(true);
    setPaymentBreakdownData(data);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setPaywithWallet(false);
    setUpdateFormData({
      amountPayableBy: "",
      amountOwned: "",
      amountPaid: "",
      availableBalance: "",
      comment: "",
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await get(`/patientpayment/${patientId}`);

      setData([response]);
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  console.log(patientId);
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
      {!isloading ? (
        <div className="w-100 none-flex-item m-t-40">
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th className="w-10">Date</th>
                <th>Service</th>
                <th className="w-60">Payment Breakdown</th>
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
                              <th>Category</th>
                              <th>Total Cost</th>
                              <th>HMO Cover</th>
                              <th>HMO Due Pay</th>
                              <th>HMO Balance</th>

                              <th>Patient Due Pay</th>
                              <th>Patient Balance</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row?.paymentBreakdowns.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.category?.name}</td>
                                <td>{item?.cost}</td>
                                <td>{item?.hmoDuePay}</td>
                                <td>{item?.hmoCover}</td>
                                <td
                                  className={
                                    item?.hmoBalance > 0
                                      ? "positiveBalance"
                                      : "zeroBalance"
                                  }
                                >
                                  {item?.hmoBalance}
                                </td>
                                <td>{item?.duePay}</td>
                                <td
                                  className={
                                    item.patientBalance > 0
                                      ? "positiveBalance"
                                      : "zeroBalance"
                                  }
                                >
                                  {item?.patientBalance}
                                </td>
                                <td>
                                  {" "}
                                  <button
                                    className="status-btn px-5"
                                    onClick={() => handleUpdateModalOpen(item)}
                                  >
                                    Update Payment
                                  </button>
                                </td>
                                <td>
                                  {" "}
                                  <button
                                    className="status-btn px-5"
                                    onClick={() => { handleUpdateModalOpen(item); setPaywithWallet(true) }}
                                  >
                                    Pay From Wallet
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div></div>
                      </div>
                    )}
                  </td>
                  <td>{row?.hmoDeposit}</td>
                  <td>{row?.hmoBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Loading....</div>
      )}

      {isUpdateModalOpen &&
        <UpdateModal
          setpaid={setpaid}
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateModalClose}
          paymentBreakdownData={paymentBreakdownData}
          amountOwed={paymentBreakdownData?.patientBalance}
          patientId={paymentBreakdownData?.patient?.id}
          patientPaymentId={paymentBreakdownData?.id}
          paywithWallet={paywithWallet}
        />
      }

      {modalOpen && (
        <ImmunizationAttachment closeModal={toggleModal} data={attachments} />
      )}
    </div>
  );
}

export default PatientPaymentTable;
