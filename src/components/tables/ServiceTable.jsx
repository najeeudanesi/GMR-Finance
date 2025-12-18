import React, { useEffect, useState } from "react";
import { formatDate } from "../../utility/general";
import { get, del } from "../../utility/fetch";
import ViewVisit from "../modals/ViewVisit";
import edit from "../../assets/images/edit.png";
import deletes from "../../assets/images/delete.png";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import ServiceEditModal from "../modals/ServiceEditModal";
import Pagination from "../UI/Pagination";

function ServiceTable({
  data,
  isloading,
  setserviceObject,
  setsubCategoryName,
  fetchData,
  setSelectedCategoryId,
}) {
  const [modalData, setModalData] = useState(false); // State to store the data for the modal
  const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal
  const [edits, setEdit] = useState({}); // State to store the data for the note modal
  const [categories, setcategories] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTreatmentCategory = async (page = 1, size = 10) => {
    setIsLoading(true);
    try {
      const response = await get(`/categoryItem/list/${page}/${size}`);
      setcategories(response?.resultList || []);
      setTotalPages(response?.paginationMetadata?.totalPages || 1);
    } catch (error) {
      console.log(error);
      setcategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatmentCategory(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (row) => {
    // return;
    try {
      const response = await del(`/categoryItem/${row.id}`);
      console.log(response);
      fetchTreatmentCategory(currentPage, pageSize);
    } catch (e) {
      console.log(e);
    }

    // https://api.greenzonetechnologies.com.ng/clinicapi/api/category/0
  };

  const handleEdit = (row) => {
    setEdit(row);
    setModalData(true);
    // console.log(row);
    // setserviceObject(row);
    // setsubCategoryName(row.itemName);
    // setSelectedCategoryId(row.category.id)
  };

  const handleClose = () => {
    setModalData(false);
  };

  return (
    <div className="w-100">
      {!isLoading ? (
        <div className="w-100 none-flex-item m-t-40">
          <table className="bordered-table-2">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>#</th>
                <th className="w-20">Date</th>
                <th>Category</th>
                <th>Service</th>
                <th>Unit Cost</th>
                <th>Note</th>
                <th>Is Consultation</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="white-bg">
              {categories?.map((row, index) => (
                <tr key={row?.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{formatDate(row?.createdOn)}</td>
                  <td>{row?.category.name}</td>
                  <td>{row?.itemName}</td>
                  <td>₦{row?.unitCost?.toLocaleString() || 0}</td>
                  <td>{row?.note || "-"}</td>
                  <td>{row?.isConsultation ? "Yes" : "No"}</td>
                  <td className="flex">
                    <img
                      className="cursor-pointer"
                      onClick={() => handleEdit(row)}
                      style={{ width: 20, height: 20, marginRight: 10 }}
                      src={edit}
                      alt="Edit"
                    />
                    <img
                      className="cursor-pointer"
                      onClick={() => handleDelete(row)}
                      style={{ width: 20, height: 20 }}
                      src={deletes}
                      alt="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-h-end m-t-20">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div>Loading....</div>
      )}

      {modalData && (
        <ServiceEditModal
          onSave={() => fetchTreatmentCategory(currentPage, pageSize)}
          data={edits}
          closeModal={handleClose}
        />
      )}
      {noteModalData && <></>}
    </div>
  );
}

export default ServiceTable;
