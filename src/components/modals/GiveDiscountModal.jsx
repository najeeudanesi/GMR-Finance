import React, { useState, useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { get, put } from "../../utility/fetch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TagInputs from "../UI/TagInputs";
import { post } from "../../utility/fetch2";

function UpdateModal({
  isOpen,
  onClose,
  patientId,
  topData,
  depositBalance,
  patientPaymentId,
  amountOwed,
  setpaid,
  paymentBreakdownData,
  paywithWallet,
  setPaywithWallet,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [outstandingPayments, setOutstandingPayments] = useState(null);
  const [formData, setFormData] = useState({
    comment: "string",
    patientId: 0,
    // appointmentId: 0,
    doctorId: 0,
    discountPercentage: 0,
    categoryItemId: 0,
  });
  const [payload, setPayload] = useState({
    transactionPurpose: "",
    paymentsMade: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(depositBalance, "depositBalance");

  useEffect(() => {
    // console.log(depositBalance)
    if (paymentBreakdownData) {
      console.log(paymentBreakdownData);
      setFormData({
        // patientId: parseInt(paymentBreakdownData?.patientId, 10),
        // amountPayableBy: "Patient",
        // amountOwed: paymentBreakdownData?.patientBalance || 0,
        // amountPaid: "",
        // availableBalance: 0,
        // comment: "",

        comment: "",
        patientId: paymentBreakdownData?.patientId || 0,
        // appointmentId: topData?.appointmentId || 0,
        doctorId: 235,
        discountPercentage: 0,
        categoryItemId: paymentBreakdownData?.serviceOrProductId || 0,
      });
    }
  }, [paymentBreakdownData, depositBalance]);

  // useEffect(() => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     availableBalance:
  //       topData?.patientTotalBalance - (prevData.amountPaid || 0),
  //     amountOwed:
  //       formData?.amountPayableBy === "Patient"
  //         ? paymentBreakdownData?.patientBalance
  //         : paymentBreakdownData?.hmoBalance || 0,
  //   }));
  // }, [formData.amountPaid, formData.amountOwed, formData.amountPayableBy]);

  // useEffect(() => {
  //   // if (paywithWallet) {
  //   getAllPatientsOutstanding();
  //   // }
  // }, [paywithWallet, formData.amountPayableBy]);

  // const getAllPatientsOutstanding = async () => {
  //   setLoading(true);
  //   try {
  //     let res = await get(
  //       `/patientpayment/list/1/10000/patient/${paymentBreakdownData?.patientId}/list-by-patient-id-and-total-debt`
  //     );
  //     setOutstandingPayments(res?.resultList ? res?.resultList : null);
  //   } catch (error) {
  //     setOutstandingPayments(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const intFields = ["amountOwed", "amountPaid", "availableBalance"];

    if (intFields.includes(name)) {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // const handleWalletChange = (e, name) => {
  //   if (name === "paymentsMade") {
  //     const selectedOptions = e.map((option) => ({
  //       paymentBreakdownId: option.value,
  //       transactionPurpose: payload.transactionPurpose,
  //     }));
  //     setPayload({ ...payload, paymentsMade: selectedOptions });
  //   } else if (name === "transactionPurpose") {
  //     const value = e.target.value;
  //     const updatedPaymentsMade = payload.paymentsMade.map((payment) => ({
  //       ...payment,
  //       transactionPurpose: value,
  //     }));
  //     setPayload({
  //       ...payload,
  //       transactionPurpose: value,
  //       paymentsMade: updatedPaymentsMade,
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let data = {
      ...formData,
      patientId: paymentBreakdownData?.patientId || 0,
      paymentId: patientPaymentId || 0,
      discountPercentage: +formData.discountPercentage || 0,
      comment: formData.comment || "",
      // doctorId: formData.doctorId || 0,
      // amountPayableBy: formData.amountPayableBy,
      // paymentsMade: [
      //   {
      //     patientId: formData.patientId,
      //     paymentBreakdownId: paymentBreakdownData.id,
      //     amountOwed: formData.amountOwed,
      //     amountPaid: formData.amountPaid,
      //     availableBalance: formData.availableBalance,
      //     comment: formData.comment,
      //   },
      // ],
    };
    console.log(data, "data to be sent");
    // return;

    try {
      const response = await post(`/PatientPayment/AddDiscount`, data);

      toast.success("Payment record updated successfully");
      navigate(`/finance/patients-payment`);

      onClose(); // Close the modal on successful submission
    } catch (e) {
      const errMessage = await e.response?.json();
      toast.error(errMessage?.errorData[0] || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // const handlePaymentFromWallet = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!payload.paymentsMade.length) {
  //     toast.error("Select at least one bill to pay");
  //     setLoading(false);
  //     return;
  //   }

  //   let data = {
  //     paymentsMade: payload.paymentsMade.map((payment) => ({
  //       paymentBreakdownId: payment.paymentBreakdownId,
  //       transactionPurpose: payment.transactionPurpose,
  //     })),
  //   };

  //   try {
  //     const response = await put(
  //       `/depositwallet/patient/${formData?.patientId}/patient-cover-bill`,
  //       data
  //     );

  //     toast.success("Payment record updated successfully");
  //     navigate(`/finance/patients-payment`);

  //     onClose(); // Close the modal on successful submission
  //   } catch (e) {
  //     console.log(e);
  //     const errMessage = await e.response?.json();
  //     console.log(errMessage);
  //     toast.error(
  //       (errMessage && errMessage?.ErrorData[0]) || "Something went wrong"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (!isOpen || !paymentBreakdownData) return null;

  return (
    <div className="overlay">
      <div className="modal-box max-w-800">
        <div className="p-40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="bold-text">Make payment For Servicezzs</h3>
            <RiCloseFill className="close-btn pointer" onClick={onClose} />
          </div>
          <form className="m-t-20">
            <div className="flex flex-col gap-3 m-t-20">
              <InputField
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
              />

              <InputField
                label="Discount Percentage"
                name="discountPercentage"
                value={formData.discountPercentage || ""}
                onChange={handleChange}
                type="number"
                required
              />
            </div>
            <button
              type="submit"
              className="btn m-t-20 w-100"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Updating..." : "Update Record"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateModal;
