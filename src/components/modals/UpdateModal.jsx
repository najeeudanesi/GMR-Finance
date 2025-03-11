import React, { useState, useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { get, put } from "../../utility/fetch";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TagInputs from "../UI/TagInputs";

function UpdateModal({
  isOpen,
  onClose,
  patientId,
  patientPaymentId,
  amountOwed,
  setpaid,
  paymentBreakdownData,
  paywithWallet,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [outstandingPayments, setOutstandingPayments] = useState(null);
  const [formData, setFormData] = useState({
    patientId: parseInt(patientId, 10),
    amountPayableBy: "Patient",
    amountOwed: amountOwed || 0,
    amountPaid: "",
    availableBalance: 0,
    comment: "",
  });
  const [payload, setPayload] = useState({
    transactionPurpose: "",
    paymentsMade: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(paymentBreakdownData?.patientId);

  

  useEffect(() => {
    if (paymentBreakdownData) {
      setFormData({
        patientId: parseInt(paymentBreakdownData?.patientId, 10),
        amountPayableBy: "Patient",
        amountOwed: paymentBreakdownData?.patientBalance || 0,
        amountPaid: "",
        availableBalance: 0,
        comment: "",
      });
    }
  }, [paymentBreakdownData]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      availableBalance: (prevData.amountOwed || 0) - (prevData.amountPaid || 0),
      amountOwed:
        formData?.amountPayableBy === "Patient"
          ? paymentBreakdownData?.patientBalance
          : paymentBreakdownData?.hmoBalance || 0,
    }));
  }, [formData.amountPaid, formData.amountOwed, formData.amountPayableBy]);

  useEffect(() => {
    if (paywithWallet) {
      getAllPatientsOutstanding();
    }
  }, [paywithWallet]);

  const getAllPatientsOutstanding = async () => {
    setLoading(true);
    try {
      let res = await get(`/patientpayment/list/1/10000/patient/${paymentBreakdownData?.patientId}/list-by-patient-id-and-total-debt`);
      setOutstandingPayments(res?.resultList ? res?.resultList : null);
    } catch (error) {
      setOutstandingPayments(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const intFields = ["amountOwed", "amountPaid", "availableBalance"];

    if (intFields.includes(name)) {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleWalletChange = (e, name) => {
    if (name === 'paymentsMade') {
      const selectedOptions = e.map(option => ({
        paymentBreakdownId: option.value,
        transactionPurpose: payload.transactionPurpose
      }));
      setPayload({ ...payload, paymentsMade: selectedOptions });
    } else if (name === 'transactionPurpose') {
      const value = e.target.value;
      const updatedPaymentsMade = payload.paymentsMade.map(payment => ({
        ...payment,
        transactionPurpose: value
      }));
      setPayload({ ...payload, transactionPurpose: value, paymentsMade: updatedPaymentsMade });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let data = {
      amountPayableBy: formData.amountPayableBy,
      paymentsMade: [
        {
          patientId: formData.patientId,
          paymentBreakdownId: paymentBreakdownData.id,
          amountOwed: formData.amountOwed,
          amountPaid: formData.amountPaid,
          availableBalance: formData.availableBalance,
          comment: formData.comment,
        },
      ],
    };

    try {
      const response = await put(
        `/patientpayment/payment-patient/${paymentBreakdownData?.patientPaymentId}/add-update-payment`,
        data
      );

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

  const handlePaymentFromWallet = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!payload.paymentsMade.length) {
      toast.error("Select at least one bill to pay");
      setLoading(false);
      return;
    }

    let data = {
      paymentsMade: payload.paymentsMade.map(payment => ({
        paymentBreakdownId: payment.paymentBreakdownId,
        transactionPurpose: payment.transactionPurpose,
      })),
    };

    try {
      const response = await put(
        `/depositwallet/patient/${(formData?.patientId)}/patient-cover-bill`,
        data
      );

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

  if (!isOpen || !paymentBreakdownData) return null;

  return (
    <div className="overlay">
      <div className="modal-box max-w-800">
        <div className="p-40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="bold-text">Make payment For Services</h3>
            <RiCloseFill className="close-btn pointer" onClick={onClose} />
            
          </div>
          <form onSubmit={paywithWallet ? handlePaymentFromWallet : handleSubmit} className="m-t-20">
            {!paywithWallet && (
              <>
                <div className="flex">
                  {" "}
                  <label htmlFor="amountPayableBy" className="label">
                    Amount Payable By
                  </label>
                  <select
                    name="amountPayableBy"
                    value={formData.amountPayableBy}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="patient">Patient</option>
                    <option value="HMO">HMO</option>
                  </select>
                </div>

                <InputField
                  label="Amount Owed"
                  name="amountOwed"
                  value={formData.amountOwed}
                  onChange={handleChange}
                  type="number"
                  disabled
                />
                <InputField
                  label="Amount Paid"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleChange}
                  type="number"
                  required
                />
                
                <InputField
                  label="Available Balance"
                  name="availableBalance"
                  value={formData.availableBalance}
                  onChange={handleChange}
                  type="number"
                  required
                  disabled
                />
                <TextArea
                  label="Comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </>
            )}

            {paywithWallet && (
              <div className="flex">
                <div className="w-100 m-t-10 ">
                  <TagInputs
                    label="Select Bill"
                    options={outstandingPayments?.map(payment => ({
                      value: payment.paymentBreakdowns[0]?.id,
                      label: `${payment.paymentBreakdowns[0]?.serviceOrProductName} - ${payment.paymentBreakdowns[0]?.cost}`
                    }))}
                    name='paymentsMade'
                    onChange={(e) => handleWalletChange(e, 'paymentsMade')}
                    type='R-select'
                    isMulti={true}
                  />
                  <TagInputs label="Purpose Of Transaction" name="transactionPurpose" value={payload?.transactionPurpose} onChange={(e) => handleWalletChange(e, 'transactionPurpose')} type='textArea' />
                </div>
              </div>
            )}
            <button
              type="submit"
              className="btn m-t-20 w-100"
              disabled={loading}
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
