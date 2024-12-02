import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import SearchInput from "../UI/SearchInput";
import edit from "../../assets/svg/edit.svg";
import EditInventoryItem from "../modals/EditInventoryItem";


function InventoryTable() {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const fetchInventoryData = async (page, size) => {
    setLoading(true);
    try {
      const data = await get(`/pharmacyinventory/list/${page}/${size}`);
      setInventoryData(data.resultList);
      setFilteredData(data.resultList); // Set filtered data initially
      setTotalPages(data.totalPages);
    } catch (e) {
      console.log("Error fetching inventory data:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventoryData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);

    // Filter inventory data based on the search text
    const filtered = inventoryData.filter((item) =>
      item.productName.toLowerCase().includes(value.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(value.toLowerCase()) ||
      item.supplier.toLowerCase().includes(value.toLowerCase()) ||
      item.inventoryNumber.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const stageData = (data) => {
    setSelectedData(data);
    setEditModalOpen(true);
  }

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-100">
      <div className="w-100 none-flex-item m-t-40">
        <div className="h-20 w-40 pt-3">
          <SearchInput
            type="text"
            onChange={handleSearchChange}
            value={searchText}
            name="searchText"
            placeholder="Search inventory..."
          />
        </div>
        <h3 className="mb-3 font-semibold">Pharmacy Inventory</h3>
        {!loading ? (
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>Item</th>
                <th>Inventory Id</th>
                <th>Manufacturer</th>
                <th>Stored Quantity</th>
                <th>Available Quantity</th>
                <th>Supplier</th>
                <th>Inventory Number</th>
                <th>Action Taken</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="white-bg view-det-pane">
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.productName}</td>
                  <td>{row.categoryId}</td>
                  <td>{row.manufacturer}</td>
                  <td>{row.storedQuantity}</td>
                  <td>{row.availableQuantity}</td>
                  <td>{row.supplier}</td>
                  <td>{row.inventoryNumber}</td>
                  <td>{row.actionTaken}</td>
                  <td> <div className="underline">
                    <img src={edit} alt="" onClick={() => stageData(row)} className="pointer" />
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>Loading...</div>
        )}
        <div className="m-t-20 flex flex-h-end">
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {
        editModalOpen && (
          <EditInventoryItem
            closeModal={() => setEditModalOpen(false)}
            isOpen={editModalOpen}
            data={selectedData}
          />)
      }

    </div>
  );
}

export default InventoryTable;
