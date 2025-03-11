import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import { get, post, put } from "../../utility/fetch";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import TagInputs from "../UI/TagInputs";
import PayForAnother from "./PayForAnother";

function MakeDeposit({ closeModal, }) {
    const [loading, setLoading] = useState(false); const [OtherServicecategories, setOtherServicecategories] = useState([]);
    const data = JSON.parse(Cookies.get('patientInfo'))
    const patientId = Number(Cookies.get("patientId"));
    const patientName = Cookies.get("patientName");
    const [payload, setPayload] = useState({
        amount: 0,
        transactionPurpose: ''
    })
    const [openModal, setOpenModal] = useState(false);

    const close = () => { setOpenModal(false) }

    const submit = async () => {
        try {
            const response = await put(`/depositwallet/patient/${(patientId)}/make-deposit`, payload);
            if (response?.statusCode === 200) {
                toast.success("Deposit made successfully");
                closeModal();
            } else {
                const errorMessages = response?.errorData?.map(error => error.message).join(', ');
                toast.error(errorMessages);
            }
        } catch (e) {
            const errMessage = await e.response?.json();
            toast.error(errMessage?.errorData[0] || "Something went wrong");
        }
    };

    const handleChange = (e, name) => {
        const value = name === 'amount' ? parseInt(e.target.value, 10) : e.target.value;
        setPayload({ ...payload, [name]: value });
    }

    return (
        <div className="overlay">
            <RiCloseFill className="close-btn pointer" onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <div className="flex gap-16 space-between">
                        <h3 className="bold-text">Make Deposit For {patientName}</h3>
                        <>
                            <button className="btn w-100" onClick={() => {
                                setOpenModal(true)
                            }
                            }>
                                Pay for anoter
                            </button></>
                    </div>
                    <div className="w-100 m-t-20 flex">
                        <TagInputs label="Amount" name='amount' onChange={(e) => handleChange(e, 'amount')} value={payload?.amount} variation='number' />

                    </div>
                    <div className="w-100 m-t-10 flex">
                        <TagInputs label="Purpose Of Transaction" name="transactionPurpose" value={payload?.transactionPurpose} onChange={(e) => handleChange(e, 'transactionPurpose')} type='textArea' />
                    </div>


                    <button
                        className="btn m-t-20 w-100"
                        onClick={submit}
                        disabled={loading}
                    >
                        Make Deposit
                    </button>
                </div>
            </div>
            {openModal && <PayForAnother closeModal={close} />}
        </div>
    );
}

export default MakeDeposit;
