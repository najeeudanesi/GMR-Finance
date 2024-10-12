import React, { useEffect, useState } from "react";
import { formatDate } from "../../utility/general";
import { get } from "../../utility/fetch";
import ViewVisit from "../modals/ViewVisit";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";

function CategoriesTable({ data, isloading }) {
    const [modalData, setModalData] = useState(null); // State to store the data for the modal
    const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal


    return (
        <div className="w-100">
            {!isloading ? (
                <div className="w-100 none-flex-item m-t-40">
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-20">Date</th>
                                <th>Name</th>

                                <th>Created By</th>

                            </tr>
                        </thead>

                        <tbody className="white-bg">
                            {data?.map((row) => (
                                <tr key={row?.id}>
                                    <td>{formatDate(row?.createdAt)}</td>
                                    <td>{row?.name}</td>

                                    <td>{row?.createdBy?.firstName} {row?.createdBy?.lastName}</td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (<div>Loading....</div>)}

            {modalData && <></>}
            {noteModalData && <></>}
        </div>
    );
}

export default CategoriesTable;
