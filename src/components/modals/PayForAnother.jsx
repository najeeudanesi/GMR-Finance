import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import { post, put } from "../../utility/fetch";
import { get } from "../../utility/fetch2";

import toast from "react-hot-toast";
import Cookies from "js-cookie";
import TagInputs from "../UI/TagInputs";
import PayForAnother_2 from "./PayForAnother_2";

function PayForAnother({ closeModal }) {
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState([]);
  const data = JSON.parse(Cookies.get("patientInfo"));
  const patientName = Cookies.get("patientName");
  const [payload, setPayload] = useState({
    thirdPartyPatientId: null,
  });
  const [allPatients, setAllPatients] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const close = () => {
    setOpenModal(false);
    setPayload({ thirdPartyPatientId: null });
  };

  const getAllPatients = async () => {
    setLoading(true);
    try {
      let res = await get(
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

  useEffect(() => {
    getAllPatients();
  }, []);

  const submit = async () => {
    try {
      setLoading(true);
      const response = await post(
        `/depositwallet/patient/${payload?.thirdPartyPatientId}/generate-otp-for-cover-third-party-bill`
      );
      if (response?.statusCode === 200) {
        toast.success("Request made successfully");
        setOpenModal(true);
      } else {
        const errorMessages = response?.errorData
          ?.map((error) => error.message)
          .join(", ");
        toast.error(errorMessages);
      }
    } catch (e) {
      const errMessage = await e.response?.json();
      toast.error(errMessage?.errorData[0] || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, name) => {
    const value = name === "thirdPartyPatientId" ? e.value : e.target.value;
    setPayload({ [name]: value });
    if (name === "thirdPartyPatientId") {
      const patient = allPatients.find(
        (patient) => patient?.patientId === e.value
      );
      setSelectedPatient(`${patient.firstName} ${patient.lastName}`);
    }
  };

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-600">
        <div className="p-40">
          <h3 className="bold-text">
            {patientName} Initating Payment For {selectedPatient}
          </h3>
          <div className="w-100 m-t-20 flex">
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
      {openModal && <PayForAnother_2 closeModal={close} />}
    </div>
  );
}

export default PayForAnother;
