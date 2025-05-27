import React, { useEffect, useState } from "react";
import { formatDate } from "../../utility/general";
import { get, del } from "../../utility/fetch";
import ViewVisit from "../modals/ViewVisit";
import edit from "../../assets/images/edit.png";
import deletes from "../../assets/images/delete.png";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import ServiceEditModal from "../modals/ServiceEditModal";

function ServiceTable({
  data,
  isloading,
  setserviceObject,
  setsubCategoryName,
  fetchData,
  setSelectedCategoryId
}) {
  const [modalData, setModalData] = useState(false); // State to store the data for the modal
  const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal
  const [edits, setEdit] = useState({}); // State to store the data for the note modal
  const [payload, setPayload] = useState({
    categoryId: 0,
    itemName: ''
  });
  const [categories, setcategories] = useState([]);

  const fetchTreatmentCategory = async () => {
    try {
      const response = await get("/categoryItem/list/1/10000");
      setcategories(response?.resultList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTreatmentCategory();
  }, []);

  const handleDelete = async (row) => {
    // return;
    try {
      const response = await del(`/categoryItem/${row.id}`);
      console.log(response);
      fetchTreatmentCategory();
    } catch (e) {
      console.log(e);
    }

    // https://api.greenzonetechnologies.com.ng/clinicapi/api/category/0
  };

  const handleEdit = (row) => {
    setEdit(row);
    setModalData(true)
    // console.log(row);
    // setserviceObject(row);
    // setsubCategoryName(row.itemName);
    // setSelectedCategoryId(row.category.id)
  };

  const handleClose = () => {
    setModalData(false);
  }



  return (
    <div className="w-100">
      {!isloading ? (
        <div className="w-100 none-flex-item m-t-40">
          <table className="bordered-table-2">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th className="w-20">Date</th>
                <th>Category</th>

                <th>Service</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="white-bg">
              {categories?.map((row) => (
                <tr key={row?.id}>
                  <td>{formatDate(row?.createdOn)}</td>
                  <td>{row?.category.name}</td>

                  <td>
                    {row?.itemName}
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

      {modalData && <>
        <ServiceEditModal onSave={() => fetchTreatmentCategory()}
          data={edits}
          closeModal={handleClose}
        />
      </>}
      {noteModalData && <></>}
    </div>
  );
}

export default ServiceTable;
