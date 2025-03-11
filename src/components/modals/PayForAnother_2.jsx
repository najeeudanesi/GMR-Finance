import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import { get, post, put } from "../../utility/fetch";
import { get as gets } from "../../utility/fetch2";

import toast from "react-hot-toast";
import Cookies from "js-cookie";
import TagInputs from "../UI/TagInputs";

function PayForAnother_2({ closeModal }) {
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState([]);
  const data = JSON.parse(Cookies.get("patientInfo"));
  const patientId = Number(Cookies.get("patientId"));
  const patientName = Cookies.get("patientName");
  const [outstandingPayments, setOutstandingPayments] = useState(null);
  const [thirdPartyPatientId, setThirdPartyPatientId] = useState(null);
  const [payload, setPayload] = useState({
    thirdPartyPatientId: null,
    paymentsMade: [
      {
        paymentBreakdownId: 0,
        transactionPurpose: "",
      },
    ],
  });
  const [otp, setOtp] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const close = () => {
    setOpenModal(false);
  };

  const getAllPatients = async () => {
    setLoading(true);
    try {
      let res = await gets(
        `/patients/AllPatient/${localStorage?.getItem(
          "clinicId"
        )}?pageIndex=${1}&pageSize=${10000}`
      );
      setAllPatients(res?.data);
    } catch (error) {
      console.error("Error fetching all patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllPatientsOutstanding = async () => {
    setLoading(true);
    try {
      let res = await get(
        `/patientpayment/list/1/10000/patient/${thirdPartyPatientId}/list-by-patient-id-and-total-debt`
      );
      setOutstandingPayments(res?.resultList ? res?.resultList : null);
    } catch (error) {
      console.error("Error fetching all patients:", error);
      setOutstandingPayments(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  const submit = async () => {
    try {
      const response = await put(
        `/depositwallet/patient/${patientId}/otp/${otp}/cover-third-party-bill`,
        payload
      );
      if (response?.statusCode === 200) {
        toast.success("Request made successfully");
        closeModal();
      } else {
        const errorMessages = response?.errorData
          ?.map((error) => error)
          ?.join(", ");
        toast.error(errorMessages);
      }
    } catch (e) {
      const errMessage = await e.response?.json();
      toast.error(errMessage?.errorData[0] || "Something went wrong");
    }
  };

  const handleChange = (e, name) => {
    if (name === "thirdPartyPatientId") {
      const value = e.value;
      setThirdPartyPatientId(value);
      const patient = allPatients.find(
        (patient) => patient.patientId === value
      );
      setSelectedPatient(`${patient.firstName} ${patient.lastName}`);
      setPayload({ ...payload, thirdPartyPatientId: value });
    } else if (name === "paymentsMade") {
      const selectedOptions = e.map((option) => ({
        paymentBreakdownId: option.value,
        transactionPurpose: payload.transactionPurpose,
      }));
      setPayload({ ...payload, paymentsMade: selectedOptions });
    } else if (name === "transactionPurpose") {
      const value = e.target.value;
      const updatedPaymentsMade = payload.paymentsMade.map((payment) => ({
        ...payment,
        transactionPurpose: value,
      }));
      setPayload({
        ...payload,
        transactionPurpose: value,
        paymentsMade: updatedPaymentsMade,
      });
    } else {
      const value = e.target.value;
      setOtp(value);
    }
  };

  useEffect(() => {
    setOutstandingPayments(null);
    if (thirdPartyPatientId) {
      getAllPatientsOutstanding();
    }
  }, [thirdPartyPatientId]);

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-600">
        <div className="p-40">
          <h3 className="bold-text">
            {patientName} Initating Payment For {selectedPatient}
          </h3>
          <div className="w-100 m-t-20 ">
            <TagInputs
              label="Enter OTP"
              name="otp"
              onChange={(e) => handleChange(e, "otp")}
              type="text"
            />
            <TagInputs
              label="Select Patient"
              options={allPatients?.map((patient) => ({
                value: patient?.patientId,
                label: `${patient?.firstName} ${patient?.lastName}`,
              }))}
              name="thirdPartyPatientId"
              onChange={(e) => handleChange(e, "thirdPartyPatientId")}
              type="R-select"
            />
            <>
              {Array.isArray(outstandingPayments) && (
                <TagInputs
                  label="Select Bill"
                  options={outstandingPayments?.map((payment) => ({
                    value: payment?.paymentBreakdowns[0]?.id,
                    label: `${payment?.paymentBreakdowns[0]?.serviceOrProductName} - ${payment?.paymentBreakdowns[0]?.cost}`,
                  }))}
                  name="paymentsMade"
                  onChange={(e) => handleChange(e, "paymentsMade")}
                  type="R-select"
                  isMulti={true}
                />
              )}
            </>
            <div className="w-100 m-t-10 flex">
              <TagInputs
                label="Purpose Of Transaction"
                name="transactionPurpose"
                value={payload?.transactionPurpose}
                onChange={(e) => handleChange(e, "transactionPurpose")}
                type="textArea"
              />
            </div>
          </div>
          <button
            className="btn m-t-20 w-100"
            onClick={submit}
            disabled={loading}
          >
            Initiate Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayForAnother_2;
