import React, { useState, useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import TextArea from "../UI/TextArea";
import { put } from "../../utility/fetch";
import toast from "react-hot-toast";

function UpdateModal({
  isOpen,
  onClose,
  patientId,
  patientPaymentId,
  amountOwed,
  paymentBreakdownData,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    patientId: parseInt(patientId, 10),
    amountPayableBy: "Patient",
    amountOwed: amountOwed || 0,
    amountPaid: "",
    availableBalance: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setFormData({
      patientId: parseInt(paymentBreakdownData?.patientId, 10),
      amountPayableBy: "Patient",
      amountOwed: paymentBreakdownData?.patientBalance || 0,
      amountPaid: "",
      availableBalance: 0,
      comment: "",
    });
  }, [paymentBreakdownData]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      availableBalance: (prevData.amountOwed || 0) - (prevData.amountPaid || 0),

      amountOwed:
        formData?.amountPayableBy == "Patient"
          ? paymentBreakdownData?.patientBalance
          : paymentBreakdownData?.hmoBalance || 0,
    }));
  }, [formData.amountPaid, formData.amountOwed, formData.amountPayableBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const intFields = ["amountOwed", "amountPaid", "availableBalance"];

    if (intFields.includes(name)) {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);

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

      console.log(response);

      toast.success("Payment record updated successfully");
      onClose(); // Close the modal on successful submission
    } catch (e) {
      const errMessage = await e.response?.json();
      toast.error(errMessage?.errorData[0] || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal-box max-w-800">
        <div className="p-40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="bold-text">Add an Item</h3>
            <RiCloseFill className="close-btn pointer" onClick={onClose} />
            <p className="text-lg text-gray-500">
              Time: {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="m-t-20">
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
