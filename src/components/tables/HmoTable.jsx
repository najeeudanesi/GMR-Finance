// imports kept minimal for table
import React, { useState } from "react";
import { formatDate } from "../../utility/general";
import { useNavigate } from "react-router-dom";
import AddPackageModal from "../modals/AddPackageModal";

function HmoTable({ data, isloading, patientId, onActionClick }) {
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const navigate = useNavigate();
  return (
    <div className="w-100">
      {!isloading ? (
        <div className="w-100 ">
          {data ? (
            <div className="w-100 none-flex-item">
              <table className="bordered-table-2">
                <thead className="border-top-none">
                  <tr className="border-top-none">
                    <th className="w-20">Date</th>
                    <th>Vendor's Name</th>
                    <th>Packages</th>
                    <th>Contact Information</th>
                    <th>Phone Number</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody className="white-bg view-det-pane">
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      className="pointer"
                      onClick={() => navigate(`/finance/insurance/${row?.id}`)}
                    >
                      <td>{formatDate(row?.createdOn) || ""}</td>

                      <td>{row?.vendorName}</td>
                      <td>{row?.packages?.map((pkg) => pkg.name).join(", ")}</td>
                      <td>{row?.email}</td>
                      <td>{row?.phoneNumber}</td>
                      <td>
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRow(row);
                            setShowAddPackage(true);
                          }}
                        >
                          Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddPackage && (
                <AddPackageModal
                  defaultValue=""
                  closeModal={() => {
                    setShowAddPackage(false);
                    setActiveRow(null);
                  }}
                  onAdd={(packageName) => {
                    // If parent provided a handler, call it with (row, packageName)
                    if (typeof onActionClick === "function")
                      onActionClick(activeRow, packageName);
                    else
                      console.log("Add package", packageName, "for", activeRow);
                  }}
                />
              )}
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
}

export default HmoTable;
