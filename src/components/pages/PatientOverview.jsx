import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../UI/InputField";
import downloadImg from "../../assets/images/download.png";
import SearchInput from "../UI/SearchInput";
import PatientPaymentTable from "../tables/PatientPaymentTable";
import UpdateModal from "../modals/UpdateModal";
import toast from "react-hot-toast";
import PaymentHistory from "../modals/PaymentHistory";

function PatientOverview() {
  const [patient, setPatient] = useState(null);
  const [extraDetails, setExtraDetails] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [isPaymentHistoryCollapsed, setIsPaymentHistoryCollapsed] = useState(true);
  const [hmoClass, setHmoClass] = useState('');
  const [updateFormData, setUpdateFormData] = useState({
    amountPayableBy: "",
    amountOwned: "",
    amountPaid: "",
    availableBalance: "",
    comment: "",
  });
  const { patientId } = useParams();
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const getPatientDetails = async () => {
    try {
      const data = await get(`/patientpayment/${patientId}`);
      setPatient(data);
      setHmoClass(data?.paymentBreakdowns[0]?.hmoClass?.hmoClass);
      console.log(data);
      getPatientExtraDetails(data?.patient?.id)
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch patient details");
    }
  };

  const getPatientExtraDetails = async (id) => {
    try {
      const data = await get(`/patient/${id}`);
      setExtraDetails(data);
      console.log(data)
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch extra patient details");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getPatientDetails(), ]);
      setLoading(false);
    };
    fetchData();
  }, [patientId]);

  const handleUpdateModalOpen = () => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setUpdateFormData({
      amountPayableBy: "",
      amountOwned: "",
      amountPaid: "",
      availableBalance: "",
      comment: "",
    });
  };

  const handleClosePaymentHistory = () => {
    setIsPaymentHistoryOpen(false);
  };

  const togglePaymentHistory = () => {
    setIsPaymentHistoryCollapsed(!isPaymentHistoryCollapsed);
  };

  if (loading) {
    return <div className="mt-4">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="mt-10">
        <div className="w-full">
          <div className="w-full mt-5 underline-container flex items-center justify-between py-4">
            <h2 className="text-xl font-semibold">Patient Payments</h2>
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

          <div className="flex justify-between w-full mt-10">
            <div className="flex items-start gap-8 w-7/12">
              <img
                src={
                  extraDetails?.pictureUrl ||
                  `https://cdn-icons-png.freepik.com/512/14026/14026766.png`
                }
                alt="Profile"
                className="w-36 h-36 object-cover"
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mt-10">
                  <p className="font-bold">Patient Name:</p>
                  <p
                    className="text-green-500 cursor-pointer underline"
                    onClick={() =>
                      navigate(`/finance/patients-details/${patientId}`)
                    }
                  >
                    {patient?.patient.firstName} {patient?.patient?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">Patient #ID:</p>
                  <p>{patient?.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">Visit Date</p>
                  <p>
                    {patient?.visitStartedOn} - {patient?.visitEndedOn || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-6/12">
              <InputField
                label="HMO class"
                disabled={true}
                value={hmoClass || "n/a"}
              />
              <InputField
                label="Validity"
                disabled={true}
                value={extraDetails?.patientHmo?.validity || "n/a"}
              />
            </div>
          </div>
          <div className="w-1/2 items-center flex">
            <InputField
              label="HMO Service Provider"
              disabled={true}
              value={extraDetails?.patientHmo?.hmoServiceProvider || "n/a"}
            />
          </div>

          <PatientPaymentTable patientId={patientId} />
          <div className="flex justify-end gap-4 mt-5">
            {/* <button className="status-btn px-5" onClick={handleUpdateModalOpen}>
              Update Payment
            </button> */}
            {/* <button className="comment-btn px-5" onClick={handleMakePayment}>
              Make Payment
            </button> */}
          </div>

          <div className="mt-5">
            <h3 className="font-semibold cursor-pointer save-drafts" onClick={togglePaymentHistory}>
              {isPaymentHistoryCollapsed ? "Show" : "Hide"} Payment History
            </h3>
            {!isPaymentHistoryCollapsed && (
              <PaymentHistory
                patientId={patient?.patient?.id}
              />
            )}
          </div>

          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={handleUpdateModalClose}
            amountOwed={patient?.patientBalance}
            patientId={patient?.patient?.id}
            patientPaymentId={patient?.id}
          />
        </div>
      </div>
    </div>
  );
}

export default PatientOverview;