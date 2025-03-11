import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { get } from "../../utility/fetch";
import SearchInput from "../UI/SearchInput";
import CostTable from "../tables/CostTable";
import Pagination from "../UI/Pagination";
import AddCost from "../modals/AddCost";
import SortInput from "../UI/SortInput";

function CostSetUp() {
  const [costData, setCostData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const sortOptions = [
    { value: "name", label: "Name" }
  ];


  const userId = localStorage.getItem("userId");

  const getTableData = async (page, size) => {
    try {
      const data = await get(`/costsetup/list/${page}/${size}`);
      setCostData(data.resultList);
      setFilteredData(data.resultList);
      setTotalPages(data.totalPages);
      console.log(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const getFilteredData = async (filterOn, filterQuery, page, size) => {
    try {
      const data = await get(`/costsetup/filter-list/${filterOn}/${filterQuery}/${page}/${size}`);
      setFilteredData(data.resultList);
      setTotalPages(data.totalPages);
      console.log(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    setLoading(true);
    if (searchText === "") {
      await getTableData(currentPage, pageSize);
    } else {
      await getFilteredData("ItemName", searchText, currentPage, pageSize);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, currentPage, pageSize]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full m-t-80 p-20">
      <div >
        <h3 className="mb-3 font-semibold">Item Pricing (Product/Service/Others)</h3>
        <div className="flex justify-end w-full">
          <div className="flex items-center space-x-4 w-[70%]">
            <div className="flex-grow">
              <SearchInput type="text" onChange={handleSearchChange} value={searchText} name="searchText" />
            </div>
            <div className="w-20">
              <SortInput
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              placeholder="Sort by"
              />
            </div>
            <button className="btn w-40" onClick={() => setModal(true)}>+ Add Item</button>
          </div>
        </div>
        {!loading ? (
          <div>
            <div className="">
              <CostTable data={filteredData} />
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
      {modal && <div> <AddCost closeModal={() => setModal(false)} fetchData={fetchData} /></div>}
    </div>
  );
}

export default CostSetUp;