import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";

function InventoryTable() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInventoryData = async (page, size) => {
    setLoading(true);
    try {
      const data = await get(`/pharmacyinventory/list/${page}/${size}`);
      setInventoryData(data.resultList);
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

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="white-bg view-det-pane">
              {inventoryData.map((row, index) => (
                <tr key={index}>
                  <td>{row.productName}</td>
                  <td>{row.categoryId}</td>
                  <td>{row.manufacturer}</td>
                  <td>{row.storedQuantity}</td>
                  <td>{row.availableQuantity}</td>
                  <td>{row.supplier}</td>
                  <td>{row.inventoryNumber}</td>
                  <td>{row.actionTaken}</td>
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
    </div>
  );
}

export default InventoryTable;
