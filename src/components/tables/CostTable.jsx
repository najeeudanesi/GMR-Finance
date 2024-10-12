import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";

function CostTable({ data }) {

    const navigate = useNavigate();

    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Item #ID</th>
                            <th>Unit Cost</th>

                            <th>Entry By:</th>
                            <th>Last Updated</th>

                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td>{row.serviceName}</td>
                                    <td>{row.category.name}</td>
                                    <td>{row.itemId}</td>
                                    <td>NGN {row.unitCost}</td>

                                    <td>{row.createdBy.firstName + " " + row.createdBy.lastName}</td>
                                    <td>{formatDate(row.modifiedOn)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CostTable;
