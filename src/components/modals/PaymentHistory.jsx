import React, { useState, useEffect } from "react";
import { RiCloseFill } from 'react-icons/ri';
import PaymentHistoryTable from "../tables/PaymentHistoryTable";

function PaymentHistory({ onClose, isOpen }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className='overlay'>
      <RiCloseFill className='close-btn pointer' onClick={onClose} />
      <div className="modal-box max-w-800">
        <div className="p-40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="bold-text">Payment History</h3>
            <p className="text-lg text-gray-500">
              Time: {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="m-t-20">
            <PaymentHistoryTable />
          </div>
          <button 
            onClick={onClose}
            className="btn m-t-20 w-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;