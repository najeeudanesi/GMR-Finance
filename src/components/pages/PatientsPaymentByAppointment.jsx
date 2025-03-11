import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import "react-datepicker/dist/react-datepicker.css";
import PatientsTable from "../tables/PatientsTable";
import downloadImg from "../../assets/images/download.png";
import SearchInput from "../UI/SearchInput";
import { get } from "../../utility/fetch2";
import { get as gets } from "../../utility/fetch";
import SortInput from "../UI/SortInput";
import Pagination from "../UI/Pagination 2";
import PatientsInvoiceTable from "../tables/PatientsInvoiceTable";

function PatientsPaymentsByAppointment() {
  const [costData, setCostData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("FirstName");

  const sortOptions = [
    { value: "FirstName", label: "First Name" },
    { value: "LastName", label: "Last Name" },
    { value: "PatientId", label: "Patient ID" },
    { value: "CreatedOn", label: "Created On" },
    { value: "ModifiedBy", label: "Modified By" },
  ];


  const fetchData = useCallback(
    // Appointment/get-appointment-bypatientId/105?pageIndex=1&pageSize=10
    async (page, filter, query) => {
      setLoading(true);
      try {
        let data;
        data = await get(
          `/patients/filter?pageIndex=${currentPage}&pageSize=${pageSize}&${filter}=${query}`
        );
        // if (filter && query) {
        //   data = await get(
        //     `/patients/filter/${filter}/${query}/${page}/${pageSize}`
        //   );
        // } else {
        //   data = await get(
        //     `/patients/list/${page}/${pageSize}/patient-payment-list`
        //   );
        // }
        console.log(data)
        setCostData(data.data || []);
        setTotalPages(data.pageCount || 1);
      } catch (error) {
        setCostData([]);
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    },
    [currentPage]
  );


  const debouncedFetchData = useCallback(
    debounce((page, filter, query) => fetchData(page, filter, query), 150),
    [fetchData]
  );

  useEffect(() => {
    debouncedFetchData(currentPage, sortBy, searchText);
  }, [currentPage, sortBy, searchText, debouncedFetchData]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    console.log()
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = (currentPage, totalPages) => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
      }
    }
    return pages;
  };


  return (
    <div className="w-100 m-t-80 p-20">

      <div className="items-center">
        <div className="flex flex-v-center w-100 space-between">
          <h3 className="font-semibold">Patients Management</h3>
          <div className="flex flex-v-end space-between w-50 m-t-1 gap-10">
            <div className="w-75">
              <SearchInput
                type="text"
                onChange={handleSearchChange}
                value={searchText}
                name="searchText"
              />
            </div>
            <div className="w-50">
              <SortInput
                value={sortBy}
                onChange={handleSortChange}
                options={sortOptions}
                placeholder="Sort by"
              />
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
        {loading ? <div className="m-t-20">Loading...</div> : (<> <div className="">
          <PatientsInvoiceTable data={costData} />
        </div>
          <div className="m-t-20 flex flex-h-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              generatePageNumbers={generatePageNumbers}
            />
          </div></>)}

      </div>

    </div>
  );
}

export default PatientsPaymentsByAppointment;
