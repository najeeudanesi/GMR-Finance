import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";

function PatientsTable({ data }) {

  const navigate = useNavigate();

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none ">
            <tr className="border-top-none ">
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>

              <th>Outstanding Payment</th>
              <th>Last Updated By</th>
              <th>Date Created</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {data?.map((row, index) => {


              return (
                <tr key={index} className="pointer" onClick={() => navigate(`/finance/patients-payment/${row.id}`)}>
                  <td>{row.id}</td>
                  <td>{row?.patient?.firstName}</td>
                  <td>{row?.patient?.lastName}</td>

                  <td>NGN {row.hmoBalance}</td>
                  <td>{row.modifiedBy.firstName ? (row.modifiedBy.firstName + " " + row.modifiedBy.lastName) : 'Not Modified'}</td>
                  <td>{formatDate(row.createdOn)}</td>
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
