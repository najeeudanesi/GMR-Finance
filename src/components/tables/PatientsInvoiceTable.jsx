import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { get } from "../../utility/fetch2";
import { get as gets } from "../../utility/fetch";
import "../../assets/css/table.css";
import { RiCloseFill } from "react-icons/ri";
import { usePDF } from 'react-to-pdf';
import { useEffect } from "react";
import moment from "moment";

function PatientsInvoiceTable({ data }) {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [pap, setpap] = useState();
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(true);
  const [paymentHistoryModal, setPaymentHistoryModal] = useState([]);
  const [paidUsers, setPaidUsers] = useState([]);

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



  // useEffect(() => {
  //   fetchPaidUsers();
  // }, []);

  // http://localhost:3002/?emp=cf0dabb00c034daab330084924aa6119ebaf53547caf4ecba4c74855bd958b87&base=https://api.greenzonetechnologies.com.ng&help=/helpmaterial/EdoGov%20Step%20by%20Step%20Guide%20v0.2.pdf&dashboard=False&approval=False&budget=False

  /** Handle row click and toggle slide-down form */
  const handleRowClick = (index, row) => {
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
    console.log(row);
    fetchPatientsBreakdownByAppointmentId(row.id);
  };

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        {/* Patients Table */}
        <table className="bordered-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
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
                onClick={() =>
                  fetchPatientsAppointmentData(row.id || row.patientId)
                }
              >
                <td>{moment(row?.updatedAt).format("YYYY-MM-DD")}</td>
                <td>{moment(row?.updatedAt).format("HH:mm")}</td>
                <td>#{row?.id}</td>
                <td>{row?.firstName}</td>
                <td>{row?.lastName}</td>
                <td>{row?.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Data Table (Shown only if data exists) */}
      {openModal && (
        <div className="overlay">
          <RiCloseFill
            className="close-btn pointer"
            onClick={() => setOpenModal(false)}
          />
          <div className="mb-3 flex gap-2">
            <button
              className={`btn ${
                showAppointmentsModal
                  ? "bg-green-500 text-white"
                  : "bg-yellow-300 text-black"
              }`}
              onClick={() => setShowAppointmentsModal(true)}
              // disabled={showAppointmentsModal}
            >
              Show Appointments Table
            </button>
            <button
              className={`btn ${
                !showAppointmentsModal
                  ? "bg-green-500 text-white"
                  : "bg-yellow-300 text-black"
              }`}
              onClick={async () => {
                setShowAppointmentsModal(false);
                if (paymentHistoryModal.length === 0) {
                  try {
                    const resp = await gets(
                      "/patientpayment/list/patient/5393/1/10/patient-payment-history"
                    );
                    setPaymentHistoryModal(resp?.resultList || []);
                  } catch (e) {
                    setPaymentHistoryModal([]);
                  }
                }
              }}
              // disabled={!showAppointmentsModal}
            >
              Show Payment History Table
            </button>
          </div>
          {showAppointmentsModal ? (
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
                      <tr
                        className={`slide-down ${
                          selectedRowIndex === index ? "active" : ""
                        }`}
                      >
                        <td colSpan="4">
                          <div
                            className={`invoice-container ${
                              selectedRowIndex === index ? "active" : ""
                            }`}
                          >
                            <InvoicePrinter patient={pap} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="bordered-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Diagnosis</th>
                  <th>Visit Started</th>
                  <th>Service Name</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="white-bg view-det-pane">
                {paymentHistoryModal.length > 0 ? (
                  paymentHistoryModal.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td>{row.id}</td>
                      <td>{row.diagnosis}</td>
                      <td>{row.visitStartedOn}</td>
                      <td>
                        {row.paymentBreakdowns?.[0]?.serviceOrProductName || ""}
                      </td>
                      <td>
                        N
                        {row.paymentBreakdowns?.[0]?.cost?.toLocaleString() ||
                          0}
                      </td>
                      <td>{row.paymentBreakdowns?.[0]?.status || ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No payment history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientsInvoiceTable;

// Import the new invoice styles

const Invoice = React.forwardRef(({ patient, onBack }, ref) => {
   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  return (
    <div>
       <button onClick={() => toPDF()}>Download PDF</button>

      <div ref={ref} className="invoice-container">
        <div className="invoice-header">
          <h2>Invoice</h2>
          {/* <button className="back-button" onClick={onBack}>← Back</button> */}
        </div>
        {patient ? (
          <div>
            <div ref={targetRef}>
              <div className="invoice-info">
                <p>
                  <strong className="value">Patient Name:</strong>{" "}
                  <span className="value">
                    {patient?.firstName} {patient?.lastName}
                  </span>
                </p>
              </div>
              {/* Screen version - Table */}
              <div className="screen-only">
                <table className="bordered-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Cost</th>
                      <th>Amount Paid</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patient?.payments?.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.itemName}</td>
                        <td>N{payment.itemCost}</td>
                        <td>N{payment.amountPaid}</td>
                        <td>N{payment.patientBalance}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="summary-row">
                      <td colSpan="2">
                        <strong>Total Payments Made:</strong>
                      </td>
                      <td>
                        <strong>N{patient?.totalPaymentsMade}</strong>
                      </td>
                      <td>
                        <strong>N{patient?.totalOutstandingPayments}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Print version - List */}
              <div className="print-only" style={{ display: "none" }}>
                <h3>Payment Details:</h3>
                <div className="payment-list">
                  {patient?.payments?.map((payment, index) => (
                    <div key={index} className="payment-item">
                      <div className="item-line">
                        <span className="value">Item:</span>
                        <span className="value">{payment.itemName}</span>
                      </div>
                      <div className="item-line">
                        <span className="value">Cost:</span>
                        <span className="value">N{payment.itemCost}</span>
                      </div>
                      <div className="item-line">
                        <span className="value">Amount Paid:</span>
                        <span className="value">N{payment.amountPaid}</span>
                      </div>
                      <div className="item-line">
                        <span className="value">Balance:</span>
                        <span className="value">N{payment.patientBalance}</span>
                      </div>
                      <hr className="item-separator" />
                    </div>
                  ))}
                </div>
                <div className="summary-section">
                  <div className="summary-line">
                    <span className="value">Total Payments Made:</span>
                    <span className="value">N{patient?.totalPaymentsMade}</span>
                  </div>
                  <div className="summary-line">
                    <span className="value">Total Outstanding:</span>
                    <span className="value">
                      N{patient?.totalOutstandingPayments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          "There is no information for this appointment date"
        )}
      </div>
    </div>
  );
});

const InvoicePrinter = ({ patient, onBack }) => {
  const invoiceRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice - ${patient?.firstName} ${patient?.lastName}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      /* Default styles - hide print-only content */
      .print-only {
        display: none !important;
      }
      .screen-only {
        display: block !important;
      }
      /* Screen specific styles */
      @media screen {
        .print-only {
          display: none !important;
          visibility: hidden !important;
        }
        .screen-only {
          display: block !important;
          visibility: visible !important;
        }
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        .screen-only {
          display: none !important;
          visibility: hidden !important;
        }
        .print-only {
          display: block !important;
          visibility: visible !important;
        }
        .payment-list {
          margin: 20px 0;
          font-size: 16px;
        }
        .payment-item {
          margin-bottom: 15px;
          padding: 10px 0;
        }
        .item-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          padding: 2px 0;
          font-size: 16px;
        }
        .label {
          font-weight: bold;
          width: 40%;
          color: #000 !important;
          font-size: 16px;
        }
        .value {
          width: 60%;
          text-align: right;
          font-weight: bold;
          color: #000 !important;
          font-size: 16px;
        }
        .item-separator {
          border: none;
          border-bottom: 1px solid #ccc;
          margin: 10px 0;
        }
        .summary-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #000;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .summary-label {
          font-weight: bold;
          color: #000 !important;
          font-size: 18px;
        }
        .summary-value {
          font-weight: bold;
          color: #000 !important;
          font-size: 18px;
        }
        h3 {
          margin-top: 20px;
          margin-bottom: 15px;
          color: #000 !important;
          font-weight: bold;
          font-size: 20px;
        }
      }
    `,
  });

  return (
    <>
      <Invoice ref={invoiceRef} patient={patient} onBack={onBack} />
      {patient && (
        <button className="print-button" onClick={handlePrint}>
          🖨 Print Invoice
        </button>
      )}
    </>
  );
};
