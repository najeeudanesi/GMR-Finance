import React, { useEffect, useRef, useState } from "react";
import { RiCloseFill } from "react-icons/ri";

const AddPackageModal = ({ closeModal, onAdd, defaultValue = "" }) => {
  const [packageName, setPackageName] = useState(defaultValue || "");
  const inputRef = useRef(null);

  useEffect(() => {
    // Autofocus the input when modal mounts
    if (inputRef.current) inputRef.current.focus();

    const handleKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "Enter") {
        if (packageName && packageName.trim() !== "") handleAdd();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageName]);

  const handleAdd = () => {
    const name = (packageName || "").trim();
    if (!name) {
      // keep modal open and focus input
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    if (typeof onAdd === "function") onAdd(name);
    closeModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-package-heading"
      onClick={(e) => {
        // close when clicking on backdrop only
        if (e.target === e.currentTarget) closeModal();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        className="modal-box max-w-400 p-24"
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          position: "relative",
          padding: 20,
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
            fontSize: 20,
            color: "#444",
          }}
        >
          <RiCloseFill />
        </button>

        <h3 id="add-package-heading" style={{ marginBottom: 12 }}>
          Add Package
        </h3>

        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="packageName"
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              color: "#333",
            }}
          >
            Package name
          </label>

          <input
            id="packageName"
            ref={inputRef}
            autoFocus
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="E.g., Basic Coverage"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              outline: "none",
              boxSizing: "border-box",
            }}
            aria-label="Package name"
          />
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
            Press Enter to add or Escape to close
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            className="btn"
            onClick={handleAdd}
            disabled={!packageName || packageName.trim() === ""}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              background:
                packageName && packageName.trim() !== ""
                  ? "#0b74de"
                  : "#b7d3f2",
              color: "#fff",
              border: "none",
              cursor:
                packageName && packageName.trim() !== ""
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            Add
          </button>
          <button
            className="btn btn-secondary"
            onClick={closeModal}
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackageModal;
