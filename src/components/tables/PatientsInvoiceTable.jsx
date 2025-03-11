import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../utility/fetch2";
import { get as gets } from "../../utility/fetch";
import "../../assets/css/table.css";
import { RiCloseFill } from "react-icons/ri";
import cadeuces from "../../assets/images/medicine.png";
import { usePDF } from "react-to-pdf";

function PatientsInvoiceTable({ data }) {
  // const navigate = useNavigate();
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [openModal, setOpenModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
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
    setSelectedRow(row);
    fetchPatientsBreakdownByAppointmentId(row.id);
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
          <RiCloseFill
            className="close-btn pointer"
            onClick={() => setOpenModal(false)}
          />

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
                          <Invoice ref={targetRef} patient={pap} row={selectedRow} />
                          <button onClick={() => toPDF()}>Download PDF</button>
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

const Invoice = React.forwardRef(({ patient, row }, ref) => {
  // Compute totals from the payments array
  const totalPaymentsMade =
    patient?.payments?.reduce(
      (acc, payment) => acc + Number(payment.amountPaid),
      0
    ) || 0;
  const totalOutstandingPayments =
    patient?.payments?.reduce(
      (acc, payment) => acc + Number(payment.patientBalance),
      0
    ) || 0;

  return (
    <div ref={ref} className="invoice-container">
      <div
        style={{
          width: "8.5in",
          height: "11in",
          margin: "0 auto",
          padding: "1in",
          backgroundColor: "#fff",
          position: "relative",
          fontFamily: "'caligraphy'",
          color: "#000",
          boxSizing: "border-box",
        }}
      >
        {/* Top Section */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div
            style={{ display: "flex", gap: "2rem", justifyContent: "center" }}
          >
            <img
              src={cadeuces}
              alt="Heartland Logo"
              style={{ height: "60px", marginBottom: "0.5rem" }}
            />
            <h1 style={{ fontSize: "28px", color: "#2d4e8d", margin: 0 }}>
              <span className="caligraphy">H</span>eartland{" "}
              <span className="caligraphy">C</span>ardiovascular{" "}
              <span className="caligraphy">C</span>onsultants
            </h1>
          </div>
          <p
            style={{
              fontSize: "14px",
              fontStyle: "italic",
              margin: "0.5rem 0 0",
            }}
          >
            Onye G. Achilihu, MD, FACC Fellow, American College of Cardiology
          </p>

          {/* Address & Contact */}
          <div style={{ marginTop: "1rem", fontSize: "14px" }}>
            <p style={{ color: "#BA1B25", margin: "0 0 0.3rem" }}>Address:</p>
            <p style={{ margin: "0" }}>
              Plot 1714 TY Danjuma Street, Asokoro, FCT Abuja.
            </p>
            <p style={{ margin: "0" }}>Tel: 08024209268, 08118901242</p>
            <p style={{ margin: "0" }}>Email: achilihu@gmail.com</p>
          </div>
        </div>

        {/* Body Section */}
        <div style={{ minHeight: "6in" }}>
          <div className="invoice-header">
            <h2>Invoice</h2>
            {/* <button onClick={onBack}>← Back</button> */}
          </div>
          {patient ? (
            <div>
              <div className="invoice-info">
                <p>
                  <strong>Patient Name:</strong> {patient?.firstName}{" "}
                  {patient?.lastName}
                </p>
              </div>
              <table className="bordered-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Cost</th>
                    <th>Amount Paid</th>
                    <th>Balance</th>
                    <th>Appointment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patient?.payments.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.itemName}</td>
                      <td>N{payment.itemCost}</td>
                      <td>N{payment.amountPaid}</td>
                      <td>N{payment.patientBalance}</td>
                      <td>{row?.appointDate || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Footer for Total Summation */}
                <tfoot>
                  <tr className="summary-row">
                    <td colSpan="2">
                      <strong>Total Payments Made:</strong>
                    </td>
                    <td>
                      <strong>N{totalPaymentsMade}</strong>
                    </td>
                    <td>
                      <strong>N{totalOutstandingPayments}</strong>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            "There is no information for this appointment date"
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "0.5in",
            left: 0,
            width: "100%",
            textAlign: "center",
            fontStyle: "italic",
            color: "#BA1B25",
          }}
        >
          The Heart Specialists
        </div>
      </div>
    </div>
  );
});
