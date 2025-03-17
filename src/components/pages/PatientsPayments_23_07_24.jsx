import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import downloadImg from "../../assets/images/download.png";
import SearchInput from "../UI/SearchInput";
import { get } from "../../utility/fetch";
import SortInput from "../UI/SortInput";
import Pagination from "../UI/Pagination";

function PatientsPayments() {
  const [costData, setCostData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const getTableData = async (page, size) => {
    try {
      const data = await get(
        `/patientpayment/list/${page}/${size}/patient-payment-list`
      );
      setCostData(data.resultList);
      setFilteredData(data.resultList);
      setTotalPages(data.totalPages);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    setLoading(true);
    await getTableData(currentPage, pageSize);
    setLoading(false);
  };

  useEffect(() => {
    const filteredResults = costData.filter((costItem) => {
      const firstName = costItem.firstName?.toLowerCase() || '';
      const lastName = costItem.lastName?.toLowerCase() || '';
      const search = searchText.toLowerCase();
      return firstName.includes(search) || lastName.includes(search);
    });
    setFilteredData(filteredResults);
  }, [searchText, costData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-100 m-t-80 p-20">
      {!loading ? (
        <div className="items-center">
          <div className="flex flex-v-center w-100 space-between">
            <h3 className="font-semibold">Patients Management</h3>
            <div className="flex flex-v-end space-between  w-50 m-t-1 gap-10 ">
              <div className="w-75">
                <SearchInput
                  type="text"
                  onChange={handleSearchChange}
                  value={searchText}
                  name="searchText"
                />
              </div>
              <div className="w-50">
                <SortInput />
              </div>
              <div className="w-13 h-13 rounded-full bg-green-300 flex items-center justify-center p-3 border border-green-700">
                <img
                  src={downloadImg}
                  alt={downloadImg}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="">
            <PatientsTable data={filteredData} />
          </div>
          <div className="m-t-20 flex flex-h-end">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div>loading....</div>
      )}
    </div>
  );
}

export default PatientsPayments;