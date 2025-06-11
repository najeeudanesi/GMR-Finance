import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";
import AddCost from "../modals/AddCost";
import deletes from "../../assets/images/delete.png";
import { del, get } from "../../utility/fetch";

function CostTable({ data, fetch, currentPage, pageSize }) {
    const [modalData, setModalData] = React.useState(null); 
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [edit, setEdit] = React.useState({});
    const [payload, setPayload] = React.useState({})
    const [costList, setCostList] = React.useState([]);


    const navigate = useNavigate();

    const handleDelete = async (row) => {
        // return;
        try {
          const response = await del(`/categoryItem/${row.id}`);
          console.log(response);
          fetch();
        } catch (e) {
          console.log(e);
        }
    
        // https://api.greenzonetechnologies.com.ng/clinicapi/api/category/0
      };
    
      const handleEdit = (row) => {
        setModalData(row); // Pass the row data to the modal
        setIsModalOpen(true); // Open the modal
      };

    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th>Item Name</th>
                            <th>Category</th>
                            {/* <th>Item #ID</th> */}
                            <th>Unit Cost</th>

                            <th>Entry By:</th>
                            <th>Last Updated</th>
                            <th>Actions</th>

                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td>{row.serviceName}</td>
                                    <td>{row.category.name}</td>
                                    {/* <td>{row.itemId}</td> */}
                                    <td>NGN {row.unitCost}</td>

                                    <td>{row.createdBy.firstName + " " + row.createdBy.lastName}</td>
                                    <td>{formatDate(row.modifiedOn)}</td>
                                    <td className="flex space-between">
                                        <button onClick={() => handleEdit(row)}>Edit</button>
                                        <img
                                            className="cursor-pointer"
                                            onClick={() => handleDelete(row)}
                                            style={{ width: 20, height: 20 }}
                                            src={deletes}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AddCost
                    closeModal={() => setIsModalOpen(false)}
                    fetchData={fetch}
                    modalData={modalData}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
}

export default CostTable;
