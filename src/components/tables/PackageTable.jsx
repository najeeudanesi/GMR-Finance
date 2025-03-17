import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";

function PackageTable({ data, selectPackage }) {
    const navigate = useNavigate();
    const [selectedPackageId, setSelectedPackageId] = useState(null);

    const handleRowClick = (id) => {
        setSelectedPackageId(id);
        selectPackage(id);
    };


    return (
        <div className="w-100">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table-2">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th>Date</th>
                            <th>Packages</th>
                        </tr>
                    </thead>
                    <tbody className="white-bg view-det-pane">
                        {data?.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowClick(row.id)}
                                className={`pointer ${selectedPackageId === row.id ? 'text-green' : ''}`}
                            >
                                <td>{formatDate(row.createdOn)}</td>
                                <td>{row.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PackageTable;
