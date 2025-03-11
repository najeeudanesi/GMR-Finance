import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../utility/fetch2";
import { get as gets } from "../../utility/fetch";
import "../../assets/css/table.css";
import { RiCloseFill } from "react-icons/ri";

function PatientsInvoiceTable({ data }) {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [pap, setpap] = useState();


  /** Fetch appointments by patient ID */
  const fetchPatientsAppointmentData = async (id) => {
    setOpenModal(true);
    try {
      const response = await get(
        `/Appointment/get-appointment-bypatientId/${id}?pageIndex=1&pageSize=10`
      );
      setAppointmentData(response.data || []);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  const fetchPatientsBreakdownByAppointmentId = async (id) => {
    // setOpenModal(true);
    // https://edogoverp.com/healthfinanceapi/api/patientpayment/getpaymentbyappointmentid?id=228

    try {
      const response = await gets(
        `/patientpayment/getpaymentbyappointmentid?id=${id}`
      );
      setpap(response || []);
    } catch (error) {
      setpap(null);

      console.error("Error fetching appointment data:", error);
    }
  };


  /** Handle row click and toggle slide-down form */
  const handleRowClick = (index, row) => {
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
    console.log(row)
    fetchPatientsBreakdownByAppointmentId(row.id)
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        {/* Patients Table */}
        <table className="bordered-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody className="white-bg view-det-pane">
            {data?.map((row, index) => (
              <tr
                key={index}
                className="pointer"
                onClick={() => fetchPatientsAppointmentData(row.id)}
              >
                <td>#{row?.patientRef}</td>
                <td>{row?.firstName}</td>
                <td>{row?.lastName}</td>
                <td>{row?.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Data Table (Shown only if data exists) */}
      {openModal && appointmentData.length > 0 && (
        <div className="overlay">
          <RiCloseFill className="close-btn pointer" onClick={() => setOpenModal(false)} />

          <table className="bordered-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointment ID</th>
                <th>Appointment Date</th>
                <th>Attending Nurse</th>
              </tr>
            </thead>
            <tbody className="white-bg view-det-pane">
              {appointmentData?.map((row, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="pointer"
                    onClick={() => handleRowClick(index, row)}
                  >
                    <td>{row?.patientName}</td>
                    <td>A-{row?.id}</td>
                    <td>{row?.appointDate}</td>
                    <td>{row?.nurse}</td>
                  </tr>

                  {/* Slide-down form for editing appointment details */}
                  {selectedRowIndex === index && (
                    <tr className={`slide-down ${selectedRowIndex === index ? "active" : ""}`}>
                      <td colSpan="4">
                        <div className={`invoice-container ${selectedRowIndex === index ? "active" : ""}`}>
                          <Invoice patient={pap} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatientsInvoiceTable;

// Import the new invoice styles


const Invoice = ({ patient, onBack }) => {
  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h2>Invoice</h2>
        {/* <button className="back-button" onClick={onBack}>← Back</button> */}
      </div>

      {patient ? <div>
        <div className="invoice-info">
          <p><strong>Patient Name:</strong> {patient?.firstName} {patient?.lastName}</p>
        </div>
        <table className="bordered-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              {/* <th>Appointment Date</th> */}
            </tr>
          </thead>
          <tbody>
            {patient?.payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.itemName}</td>
                <td>N{payment.itemCost}</td>
                <td>N{payment.amountPaid}</td>
                <td>N{payment.patientBalance}</td>
                {/* <td>{payment.appointmentDate || "N/A"}</td> */}
              </tr>
            ))}
          </tbody>
          {/* Footer for Total Summation */}
          <tfoot>
            <tr className="summary-row">
              <td colSpan="2"><strong>Total Payments Made:</strong></td>
              <td><strong>N{patient?.totalPaymentsMade}</strong></td>
              <td><strong>N{patient?.totalOutstandingPayments}</strong></td>
              {/* <td></td> */}
            </tr>
          </tfoot>
        </table>
        <button className="print-button" onClick={() => window.print()}>🖨 Print Invoice</button>
      </div> : 'There is no information for this appointment date'}
    </div>
  );
};


