import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";
import moment from "moment";

function PatientsTable({ data, currentPage = 1, pageSize = 20 }) {
  const navigate = useNavigate();

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none ">
            <tr className="border-top-none ">
              <th>S/N</th>
              <th>Date</th>
              <th>Time</th>
              <th>First Name</th>
              <th>Last Name</th>

              <th>Outstanding Payment</th>
              {/* <th>Last Updated By</th> */}
              {/* <th>Date Created</th> */}
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {data?.map((row, index) => {
              return (
                <tr
                  key={index}
                  className="pointer"
                  onClick={() =>
                    navigate(
                      `/finance/patients-payment/${row.paymentDetails[0].patient.id}`
                    )
                  }
                >
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{moment(row.dateUpdated).format("YYYY-MM-DD")}</td>
                  <td>{moment(row.dateUpdated).format("HH:mm")}</td>
                  <td>{row?.firstName}</td>
                  <td>{row?.lastname}</td>

                  <td>NGN {row.outstandingPayment}</td>
                  {/* <td>{row.modifiedBy.firstName ? (row.modifiedBy.firstName + " " + row.modifiedBy.lastName) : 'Not Modified'}</td> */}
                  {/* <td>{formatDate(row.createdOn)}</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientsTable;
