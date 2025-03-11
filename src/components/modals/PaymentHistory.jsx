import React, { useState, useEffect } from "react";
import { RiCloseFill } from 'react-icons/ri';
import PaymentHistoryTable from "../tables/PaymentHistoryTable";
import { get } from "../../utility/fetch";

function PaymentHistory({ onClose, isOpen, patientId }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [PaymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    getAllPatientsOutstanding();
  }, []);

  const getAllPatientsOutstanding = async () => {
    setLoading(true);
    try {
      let res = await get(`/depositwallet/patientid/${patientId}`);
      setPaymentHistory(res?.data ? res?.data : null);
    } catch (error) {
      setPaymentHistory(null);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className='w-100'>
      <div className="m-t-20">
        <PaymentHistoryTable data={PaymentHistory} />
      </div>
    </div>
  );
}

export default PaymentHistory;