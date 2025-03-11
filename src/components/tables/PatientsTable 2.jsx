import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import MakeDeposit from "../modals/MakeDeposit";
import toast from "react-hot-toast";
import { put } from "../../utility/fetch";

function PatientsTable({ data, currentPage, itemsPerPage, renderTabContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  let navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    Cookies.remove('patientId');
    Cookies.remove('patientInfo');
    Cookies.remove('patientName');

  };

  const createWallet = async (patientId) => {
    try {
      const response = await put(`/depositwallet`, patientId);
      if (response?.statusCode === 200) {
        toast.success("Deposit made successfully");
      } else {
        const errorMessages = response?.errorData?.map(error => error.message).join(', ');
        toast.error(errorMessages);
      }
    } catch (e) {
      const errMessage = await e.response?.json();
      toast.error(errMessage?.errorData[0] || "Something went wrong");
    }
  };



  const selectRecord = (id, data) => {
    setIsModalOpen(true);
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', JSON.stringify(data));
    Cookies.set('patientName', `${data.firstName} ${data.lastName}`);
  };


  const continueUpdate = (id, data) => {
    Cookies.set('patientId', id);
    Cookies.set('patientInfo', JSON.stringify(data));
    Cookies.set('patientName', `${data.firstName} ${data.lastName}`);
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">S/N</th>
              <th className="center-text">Patient Id</th>
              <th className="center-text">First Name</th>
              <th className="center-text">Last Name</th>
              <th className="center-text">Email</th>
              <th className="center-text">Modified By</th>
              <th className="center-text">Created On</th>
              {/* <th className="center-text"></th> */}
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) &&
              data?.map((row, index) => (
                <tr className="hovers pointer" onClick={() => selectRecord(row?.patientId || row?.id, row)} key={row?.patientId || row?.id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{row?.patientRef}</td>
                  <td>
                    <div>
                      {row?.firstName} {row?.isReferred ? <span className="add-note">Referred</span> : ''}
                    </div>
                  </td>
                  <td>{row?.lastName}</td>
                  <td>{row?.email}</td>
                  <td>{row?.modifiedByName}</td>
                  <td>{new Date(row?.createdAt).toLocaleDateString()}</td>
                  {/* <td>
                    <button>
                      Create Wallet
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>

        {isModalOpen && (
          <MakeDeposit closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

export default PatientsTable;
