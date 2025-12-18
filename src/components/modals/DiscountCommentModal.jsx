import React from "react";
import { RiCloseFill } from "react-icons/ri";

const DiscountCommentModal = ({ data, closeModal }) => {
  if (!data) return null;

  const patient = data.patient || {};
  const breakdown = data.breakdown || {};

  const patientName = `${patient.firstName || ""} ${
    patient.lastName || ""
  }`.trim();
  const serviceName =
    breakdown.serviceOrProductName || breakdown.itemName || "-";
  const cost =
    breakdown.patientDeposit != null
      ? breakdown.patientDeposit
      : breakdown.cost || "-";
  const comment =
    breakdown.discountComment ||
    breakdown.discountReason ||
    breakdown.comment ||
    "-";

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 8,
          padding: 20,
          position: "relative",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <button
          aria-label="Close"
          onClick={closeModal}
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          <RiCloseFill />
        </button>

        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Discount Details</h3>

        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <strong>Patient:</strong> {patientName || "-"}
          </div>
          <div>
            <strong>Service:</strong> {serviceName}
          </div>
          <div>
            <strong>Due Pay:</strong>{" "}
            ₦{breakdown.cost}
          </div>
           <div>
            <strong>Amount Paid:</strong>{" "}
            {typeof cost === "number" ? `₦${cost.toLocaleString()}` : cost}
          </div>
          <div>
            <strong>Discount Comment:</strong>
            <div
              style={{
                marginTop: 6,
                padding: 8,
                background: "#f7f7f7",
                borderRadius: 6,
              }}
            >
              {comment}
            </div>
          </div>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <button className="btn" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountCommentModal;
