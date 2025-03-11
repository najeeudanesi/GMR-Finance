import React, { useEffect, useState } from "react";
import { formatDate } from "../../utility/general";
import { get } from "../../utility/fetch";
import ViewVisit from "../modals/ViewVisit";
import edit from "../../assets/images/edit.png";
import deletes from "../../assets/images/delete.png";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import { del } from "../../utility/fetchClinicAPi";

function CategoriesTable({
  data,
  isloading,
  setCategoryObject,
  setCategoryName,
  fetchData,
}) {
  const [modalData, setModalData] = useState(null); // State to store the data for the modal
  const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal
  const [edits, setEdit] = useState(null); // State to store the data for the note modal

  const handleDelete = async (row) => {
    // return;
    try {
      const response = await del(`/category/${row.id}`);
      console.log(response);
      fetchData(1, 10);
    } catch (e) {
      console.log(e);
    }

    // https://api.greenzonetechnologies.com.ng/clinicapi/api/category/0
  };

  const handleEdit = (row) => {
    setEdit(row);
    console.log(row);
    setCategoryObject(row);
    setCategoryName(row.name);
  };



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
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="white-bg">
              {data?.map((row) => (
                <tr key={row?.id}>
                  <td>{formatDate(row?.createdAt)}</td>
                  <td>{row?.name}</td>

                  <td>
                    {row?.createdBy?.firstName} {row?.createdBy?.lastName}
                  </td>
                  <td className="flex">
                    <img
                      className="cursor-pointer"
                      onClick={() => handleEdit(row)}
                      style={{ width: 20, height: 20, marginRight: 10 }}
                      src={edit}
                    />
                    <img
                      className="cursor-pointer"
                      onClick={() => handleDelete(row)}
                      style={{ width: 20, height: 20 }}
                      src={deletes}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Loading....</div>
      )}

      {modalData && <></>}
      {noteModalData && <></>}
    </div>
  );
}

export default CategoriesTable;
