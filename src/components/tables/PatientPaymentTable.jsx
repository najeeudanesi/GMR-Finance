import React, { useEffect, useState } from "react";
import ImmunizationAttachment from "../modals/ImmunizationAttachments";
import { formatDate } from "../../utility/general";
import { get, del } from "../../utility/fetch";
import toast from "react-hot-toast";
import UpdateModal from "../modals/UpdateModal";
import GiveDiscountModal from "../modals/GiveDiscountModal";
// ...existing code...

// ...existing code...
// Delete payment breakdown by id

function PatientPaymentTable({ patientId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [data, setData] = useState([]);
  const [topData, setTopData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isGiveDiscountOpen, setIsGiveDiscountOpen] = useState(false);

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

  const handleUpdateModalOpen = (data, row) => {
    setTopData(row);
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
      const response = await get(
        `/patientpayment/list/1/1000/patient/${patientId}/list-by-patient-id-and-total-debt`
      );

      // const response = await get(`/patientpayment/${patientId}`);
      console.log();
      setData(response.resultList);
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  console.log(patientId);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDeletePayment = async (paymentBreakdownId) => {
    if (!window.confirm("Are you sure you want to delete this payment?"))
      return;
    try {
      await del(`/patientpayment/deletepayment?id=${paymentBreakdownId}`);
      toast.success("Payment deleted successfully");
      fetchData();
    } catch (e) {
      toast.error("Failed to delete payment");
      console.error(e);
    }
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
                <th>Diagnosis</th>
                <th className="w-60">Payment Breakdown</th>
                {/* <th>Deposit</th>
                <th>Balance</th> */}
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
                              <th>Service/Item</th>
                              <th>Total Cost</th>
                              <th>HMO Cover</th>
                              <th>HMO Due Pay</th>
                              <th>HMO Balance</th>

                              <th>Patient Due Pay</th>
                              <th>Discounted Amount</th>
                              {/* <th>Patient Balance</th> */}
                              <th>Patient to pay</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row?.paymentBreakdowns.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.serviceOrProductName}</td>
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
                                <td>{item.cost - item?.discountedAmount || 0}</td>
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
                                  <div className="flex">
                                    <button
                                      className="status-btn px-5"
                                      onClick={() =>
                                        handleUpdateModalOpen(item, row)
                                      }
                                    >
                                      Update Payment
                                    </button>
                                    <button
                                      className="status-btn px-5"
                                      style={{
                                        background: "#f6ad55",
                                        color: "#222",
                                        marginLeft: 6,
                                      }}
                                      onClick={() => {
                                        setTopData(row);
                                        setPaymentBreakdownData(item);
                                        setIsGiveDiscountOpen(true);
                                      }}
                                    >
                                      Give Discount
                                    </button>

                                    <button
                                      className="status-btn px-5"
                                      style={{
                                        background: "#e53e3e",
                                        color: "white",
                                        marginLeft: 6,
                                      }}
                                      onClick={() =>
                                        handleDeletePayment(item.id)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                                {/* <td>
                                  <button
                                    className="status-btn px-5"
                                    onClick={() => { handleUpdateModalOpen(item,row); setPaywithWallet(true) }}
                                  >
                                    Pay From Wallet
                                  </button>
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div></div>
                      </div>
                    )}
                  </td>
                  {/* <td>{row?.hmoDeposit}</td>
                  <td>{row?.hmoBalance}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Loading....</div>
      )}

      {isUpdateModalOpen && (
        <UpdateModal
          setpaid={setpaid}
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateModalClose}
          paymentBreakdownData={paymentBreakdownData}
          topData={topData}
          amountOwed={paymentBreakdownData?.patientBalance}
          patientId={paymentBreakdownData?.patient?.id}
          patientPaymentId={paymentBreakdownData?.id}
          paywithWallet={paywithWallet}
          setPaywithWallet={setPaywithWallet}
        />
      )}

      {isGiveDiscountOpen && (
        <GiveDiscountModal
          isOpen={isGiveDiscountOpen}
          onClose={() => setIsGiveDiscountOpen(false)}
          patientId={patientId}
          topData={topData}
          depositBalance={topData?.patientTotalBalance}
          patientPaymentId={topData?.id}
          amountOwed={paymentBreakdownData?.patientBalance}
          setpaid={setpaid}
          paymentBreakdownData={paymentBreakdownData}
          paywithWallet={paywithWallet}
          setPaywithWallet={setPaywithWallet}
        />
      )}

      {modalOpen && (
        <ImmunizationAttachment closeModal={toggleModal} data={attachments} />
      )}
    </div>
  );
}

export default PatientPaymentTable;
