import React, { useEffect, useState } from "react";
import { get as gets } from "../../utility/fetch2";
import { get } from "../../utility/fetch";
import "../../assets/css/table.css";
import moment from "moment";
import SearchInput from "../UI/SearchInput";
import SortInput from "../UI/SortInput";
import DiscountCommentModal from "../modals/DiscountCommentModal";

const PaymentRecords = () => {
  // Fetch service list from endpoint and map to service format

  // Fetch lab category from endpoint

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-01");
  const [paidUsers, setPaidUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortData, setSortData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("FirstName");
  const sortOptions = [
    { value: "FirstName", label: "First Name" },
    { value: "LastName", label: "Last Name" },
    // { value: "PatientId", label: "Doctor" },
    { value: "Doctor", label: "Doctor" },
    { value: "Category", label: "Category" },
    { value: "Service", label: "Service" },
    { value: "Amount", label: "Amount" },
    { value: "HMO", label: "HMO" },
    // { value: "ModifiedBy", label: "Modified By" },
  ];

  // Debounced fetch when searchText, fromDate, toDate, or sortBy changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchPaidUsers = async () => {
        setIsLoading(true);
        try {
          const response = await get(
            `/patientpayment/filter-paid-list/${fromDate}/${toDate}/${page}/20?filterOn=${sortBy}&filterQuery=${searchText}`
          );
          setPaidUsers(response.resultList || []);
          if (response.paginationMetadata) {
            setTotalPages(response.paginationMetadata.totalPages || 1);
          }
        } catch (error) {
          setPaidUsers([]);
          setTotalPages(1);
          console.error("Error fetching paid users:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPaidUsers();
      // fetchLabCategory();
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchText, fromDate, toDate, sortBy, page]);

  // useEffect(() => {
  //   fetchDoctorsPatients();
  // }, []);

  const fetchDoctorsPatients = async () => {
    try {
      const response = await gets(
        `/patients/AllDoctor/${localStorage.getItem(
          "clinicId"
        )}?pageIndex=1&pageSize=1000`
      );
      // You can use response here as needed, e.g. console.log or set state
      console.log("Doctors Patients:", response);
      setDocs(
        response?.data?.map((doc) => ({
          label: doc.username,
          value: doc.employeeId,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching doctor's patients:", error);
    }
  };

  const fetchLabCategory = async () => {
    try {
      const response = await get("/category/list/1/20");
      console.log("Lab Category:", response?.resultList);

      setDocs(
        response?.resultList?.map((doc) => ({
          label: doc.name,
          value: doc.id,
        })) || []
      );
      // You can set state here if needed, e.g. setLabCategory(response)
    } catch (error) {
      console.error("Error fetching lab category:", error);
    }
  };

  const fetchServiceList = async () => {
    try {
      const response = await get("/categoryitem/list/1/20");
      console.log(response?.resultList);
      setDocs(
        response?.resultList?.map((doc) => ({
          label: doc.itemName,
          value: doc.id,
        })) || []
      );
      // const serviceList = (response?.resultList)?.map((item) => ({
      //   label: item.itemName,
      //   value: item.id,
      // }));
      // console.log("Service List:", serviceList);
      // You can set state here if needed, e.g. setServiceList(serviceList)
    } catch (error) {
      console.error("Error fetching service list:", error);
    }
  };
  // Filter by search
  //   const filtered = paidUsers
  //   ?.filter(
  //     (user) =>
  //       user?.patientName?.toLowerCase().includes(search.toLowerCase()) ||
  //       user?.paymentDate?.toLowerCase().includes(search.toLowerCase())
  //   );

  // Sort by paymentDate
  //   const sorted = [...filtered].sort((a, b) => {
  //     const dateA = new Date(a.paymentDate);
  //     const dateB = new Date(b.paymentDate);
  //     return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  //   });

  // Removed duplicate fetchPaidUsers effect; now handled by debounced effect above

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSortChange = (event) => {
    console.log(event.target.value);
    setSortBy(event.target.value);

    if (event.target.value === "Doctor") {
      fetchDoctorsPatients();
      // Toggle sort order if the same column is selected
      // setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    }
    if (event.target.value === "Category") {
      fetchLabCategory();
      // Toggle sort order if the same column is selected
      // setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    }
    if (event.target.value === "Service") {
      fetchServiceList();
    }
  };
  const handleSortChangeDoc = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);
  };

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [activeDiscountDetail, setActiveDiscountDetail] = useState(null);
  const [cumulativeBreakdownCount, setCumulativeBreakdownCount] = useState(0);

  // Calculate total breakdown count for current page
  const currentPageBreakdownCount = paidUsers?.reduce((count, user) => {
    return count + (user?.paymentBreakdowns?.length || 0);
  }, 0);

  // Update cumulative count when page changes
  useEffect(() => {
    if (page === 1) {
      setCumulativeBreakdownCount(0);
    }
  }, [page, searchText, fromDate, toDate, sortBy]);

  // Filter by search
  // const filtered = paidUsers.filter(
  //     (user) =>
  //         user?.patientName?.toLowerCase().includes(search.toLowerCase()) ||
  //         user?.paymentDate?.toLowerCase().includes(search.toLowerCase())
  // );

  // Calculate total amount
  const totalAmount = paidUsers?.reduce((sum, user) => {
    if (user?.paymentBreakdowns && user.paymentBreakdowns.length > 0) {
      return (
        sum +
        user.paymentBreakdowns.reduce(
          (subSum, breakdown) =>
            subSum + (Number(breakdown.patientDeposit) || 0),
          0
        )
      );
    }
    return sum;
  }, 0);

  return (
    <div className="w-100 none-flex-item m-t-40">
      <h1 className="font-semibold" style={{ margin: "36px 0" }}>
        Paid Users
      </h1>
      <div
        className="flex m-t-1 gap-10"
        style={{ justifyContent: "space-between" }}
      >
        <div className="flex w-50 m-r-10 gap-10">
          <div className="w-75 flex">
            <SortInput
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              placeholder="Sort by"
            />
          </div>
          {sortBy === "Doctor" ||
          sortBy === "Category" ||
          sortBy === "Service" ? (
            <div className="w-75 flex">
              <SortInput
                value={searchText}
                onChange={handleSortChangeDoc}
                options={docs}
                placeholder="Sort by"
              />
            </div>
          ) : (
            <div className="w-75">
              <SearchInput
                type="text"
                onChange={handleSearchChange}
                value={searchText}
                name="searchText"
              />
            </div>
          )}
        </div>

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          <span>to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
      {/* 
        <div style={{ margin: "16px 0", fontWeight: "bold" }}>
          Total Amount: ₦{totalAmount.toLocaleString()}
        </div> */}

      {isLoading ? (
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <span>Loading...</span>
        </div>
      ) : (
        <div>
          {showDiscountModal && (
            <DiscountCommentModal
              data={activeDiscountDetail}
              closeModal={() => {
                setShowDiscountModal(false);
                setActiveDiscountDetail(null);
              }}
            />
          )}
          <table className="bordered-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Patient Name</th>
                <th>Consulted Doctor</th>
                <th>Payment Date</th>
                <th>Payment Time</th>
                <th>Category</th>
                <th>Service</th>
                <th>Discounted Amount</th>
                <th>Paid Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="white-bg view-det-pane">
              {paidUsers.length > 0 ? (
                <>
                  {(() => {
                    let serialNumber = cumulativeBreakdownCount;
                    return paidUsers?.flatMap((user, idx) =>
                      user?.paymentBreakdowns &&
                      user?.paymentBreakdowns?.length > 0
                        ? user?.paymentBreakdowns.map((breakdown, bIdx) => (
                            <tr
                              key={`${user.id || idx}-${breakdown.id || bIdx}`}
                            >
                              <td>{++serialNumber}</td>
                              <td>{`${user?.patient?.firstName} ${user.patient?.lastName}`}</td>
                              <td>
                                {user.attendedDoctor
                                  ? `${user.attendedDoctor.firstName || ""} ${
                                      user.attendedDoctor.lastName || ""
                                    }`
                                  : ""}
                              </td>
                              <td>
                                {moment(user.createdOn).format("YYYY-MM-DD ")}
                              </td>
                              <td>{moment(user.createdOn).format(" HH:mm")}</td>
                              <td>{breakdown.category?.name}</td>
                              <td>{breakdown.serviceOrProductName}</td>
                              <td>
                                {breakdown.discountApplied
                                  ? `${
                                      breakdown.cost - breakdown?.patientDeposit
                                    }`
                                  : "-"}
                              </td>
                              <td>
                                {breakdown.isHmoCovered
                                  ? "HMO Covered"
                                  : breakdown.patientDeposit}
                              </td>
                              <td>
                                {breakdown.discountApplied && (
                                  <button
                                    onClick={() => {
                                      setActiveDiscountDetail({
                                        patient: user.patient || {},
                                        breakdown,
                                      });
                                      setShowDiscountModal(true);
                                    }}
                                  >
                                    View Discount Comment
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        : [
                            <tr key={`${user.id || idx}-empty`}>
                              <td>{++serialNumber}</td>
                              <td>{`${user.patient?.firstName} ${user.patient?.lastName}`}</td>
                              <td>
                                {user.doctor
                                  ? `${user.doctor.firstName || ""} ${
                                      user.doctor.lastName || ""
                                    }`
                                  : ""}
                              </td>
                              <td>
                                {moment(user.createdOn).format(
                                  "YYYY-MM-DD HH:mm"
                                )}
                              </td>
                              <td colSpan={3} style={{ textAlign: "center" }}>
                                No breakdowns
                              </td>
                            </tr>,
                          ]
                    );
                  })()}
                  <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                    <td colSpan={6} style={{ textAlign: "right" }}>
                      Total Amount:
                    </td>
                    <td>₦{paidUsers[0].totalAmount.toLocaleString()}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: 16 }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "16px 0",
            }}
          >
            <button
              onClick={() => {
                setCumulativeBreakdownCount((prev) =>
                  Math.max(0, prev - currentPageBreakdownCount)
                );
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={page === 1}
              style={{ marginRight: 8 }}
            >
              Previous
            </button>
            <span style={{ margin: "0 8px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => {
                setCumulativeBreakdownCount(
                  (prev) => prev + currentPageBreakdownCount
                );
                setPage((p) => Math.min(totalPages, p + 1));
              }}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRecords;
