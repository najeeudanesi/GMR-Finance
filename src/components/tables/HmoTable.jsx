// imports kept minimal for table
import React, { useState } from "react";
import { formatDate } from "../../utility/general";
import { useNavigate } from "react-router-dom";
import AddPackageModal from "../modals/AddPackageModal";
import edit from "../../assets/svg/edit.svg";
import deleteIcon from "../../assets/svg/delete.svg";
import addIcon from "../../assets/svg/add.svg";

function HmoTable({
  data,
  isloading,
  patientId,
  onActionClick,
  currentPage = 1,
  pageSize = 10,
  onEdit,
  onDelete,
}) {
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
                    <th>S/N</th>
                    <th className="w-20">Date</th>
                    <th>HMO's Name</th>
                    <th>Packages</th>
                    <th>Contact Information</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody className="white-bg view-det-pane">
                  {data.map((row, index) => (
                    <tr key={index} className="pointer">
                      <td
                        onClick={() =>
                          navigate(`/finance/insurance/${row?.id}`)
                        }
                      >
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/finance/insurance/${row?.id}`)
                        }
                      >
                        {formatDate(row?.createdOn) || ""}
                      </td>

                      <td
                        onClick={() =>
                          navigate(`/finance/insurance/${row?.id}`)
                        }
                      >
                        {row?.vendorName}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/finance/insurance/${row?.id}`)
                        }
                      >
                        {row?.packages?.map((pkg) => pkg.name).join(", ")}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/finance/insurance/${row?.id}`)
                        }
                      >
                        {row?.email}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/finance/insurance/${row?.id}`)
                        }
                      >
                        {row?.phoneNumber}
                      </td>
                      <td>
                        <div className="flex gap-5">
                          <img
                            src={addIcon}
                            alt="Add Package"
                            className="pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRow(row);
                              setShowAddPackage(true);
                            }}
                            style={{ width: 20, height: 20, cursor: "pointer" }}
                            title="Add Package"
                          />
                          {onEdit && (
                            <img
                              src={edit}
                              alt="Edit"
                              className="pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              style={{
                                width: 20,
                                height: 20,
                                cursor: "pointer",
                              }}
                              title="Edit"
                            />
                          )}
                          {onDelete && (
                            <img
                              src={deleteIcon}
                              alt="Delete"
                              className="pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row.id);
                              }}
                              style={{
                                width: 20,
                                height: 20,
                                cursor: "pointer",
                              }}
                              title="Delete"
                            />
                          )}
                        </div>
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
