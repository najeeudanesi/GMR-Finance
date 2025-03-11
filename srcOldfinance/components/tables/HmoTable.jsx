import { useState } from "react";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import { formatDate } from "../../utility/general";
import NurseNotesTreatment from "../modals/NurseNotesTreatment";
import { useNavigate } from "react-router-dom";

function HmoTable({ data, isloading, patientId }) {
    const [noteModalData, setNoteModalData] = useState(null);

    const navigate = useNavigate();
    return (
        <div className="w-100">
            {
                !isloading ? (<div className="w-100 ">

                    {
                        data ? (
                            <div className="w-100 none-flex-item">
                                <table className="bordered-table-2">
                                    <thead className="border-top-none">
                                        <tr className="border-top-none">
                                            <th className="w-20">Date</th>
                                            <th>Vendor's Name</th>
                                            <th>Packages</th>
                                            <th>Contact Information</th>
                                            <th>Phone Number</th>

                                        </tr>
                                    </thead>

                                    <tbody className="white-bg view-det-pane">
                                        {data.map((row, index) => (
                                            <tr key={index} className="pointer" onClick={() => navigate(`/finance/insurance/${row?.id}`)}>
                                                <td>{formatDate(row?.createdOn) || ""}</td>

                                                <td>{row?.vendorName}</td>
                                                <td>{row?.packages?.length}</td>
                                                <td>{row?.email}</td>
                                                <td>{row?.phoneNumber}</td>



                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* {noteModalData && <NurseNotesTreatment closeModal={() => setNoteModalData(null)} data={noteModalData} patientId={patientId} />} */}
                            </div>
                        ) : (
                            <p>No data available</p>
                        )
                    }

                </div>) : (<div>Loading....</div>)
            }
        </div>
    );
}

export default HmoTable;
