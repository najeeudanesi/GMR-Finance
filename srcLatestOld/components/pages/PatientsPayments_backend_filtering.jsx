import React, { useEffect, useState, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import downloadImg from "../../assets/images/download.png";
import SearchInput from "../UI/SearchInput";
import { get } from "../../utility/fetch";
import Pagination from "../UI/Pagination";
import { BsChevronDown } from "react-icons/bs";
import debounce from 'lodash/debounce';

const FilterSelect = ({ value, onChange }) => (
  <div className="flex flex-v-center search-input bg-white relative h-11">
    <select
      value={value}
      onChange={onChange}
      className='w-full bg-transparent appearance-none border-none outline-none'
      style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
    >
      <option value="">No Filter</option>
      <option value="FirstName">First Name</option>
      <option value="LastName">Last Name</option>
      <option value="PatientId">Patient ID</option>
    </select>
    <BsChevronDown className="absolute right-2 pointer-events-none" />
  </div>
);

function PatientsPayments() {
  const [costData, setCostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOn, setFilterOn] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const fetchData = useCallback(async (page, filter, query) => {
    setLoading(true);
    try {
      let data;
      if (filter && query) {
        data = await get(
          `/patientpayment/filter-list/${filter}/${query}/${page}/${pageSize}`
        );
      } else {
        data = await get(
          `/patientpayment/list/${page}/${pageSize}/patient-payment-list`
        );
      }
      setCostData(data.resultList || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [pageSize]);

  const debouncedFetchData = useCallback(
    debounce((page, filter, query) => fetchData(page, filter, query), 1500),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(currentPage, filterOn, filterQuery);
  }, [debouncedFetchData, currentPage, filterOn, filterQuery]);

  const handleSearchChange = (event) => {
    setFilterQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (event) => {
    setFilterOn(event.target.value);
    setCurrentPage(1);
    if (!event.target.value) {
      setFilterQuery("");
    }
  };

  return (
    <div className="w-100 m-t-80 p-20">
      {!loading ? (
        <div className="items-center">
          <div className="flex flex-v-center w-100 space-between">
            <h3 className="font-semibold">Patients Management</h3>
            <div className="flex flex-v-end space-between w-50 m-t-1 gap-10 ">
              <div className="w-75">
                <SearchInput
                  type="text"
                  onChange={handleSearchChange}
                  value={filterQuery}
                  name="searchText"
                  placeholder={`Search by ${filterOn || 'name'}...`}
                />
              </div>
              <div className="w-50">
                <FilterSelect onChange={handleFilterChange} value={filterOn} />
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
            <PatientsTable data={costData} />
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