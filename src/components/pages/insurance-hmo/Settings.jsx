import React, { useState, useEffect } from "react";
import InputField from "../../UI/InputField";
import { get, post, del, put } from "../../../utility/fetch";
import {
  del as dels,
  post as posts,
  put as puts,
} from "../../../utility/fetchClinicAPi";
import Pagination from "../../UI/Pagination";
import CategoriesTable from "../../tables/CategoriesTable";
import ServiceTable from "../../tables/ServiceTable";

function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setsubCategoryName] = useState("");
  const [categoryObject, setCategoryObject] = useState("");
  const [serviceObject, setserviceObject] = useState("");
  const [OtherServicecategories, setOtherServicecategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setcategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState("create-hmo");

  const handleSearchChange = (event) => {
    console.log("evevt");
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "inventory":
        return (
          <div className=" gap-16 w-100 border m-t-20">
            <div className="m-t-20">
              <InputField
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
                value={categoryName}
                label="Category Name"
                name="categoryName"
                type="text"
              />
            </div>

            <button
              className="btn w-40 m-t-5"
              onClick={!categoryObject ? addCategory : editCategory}
            >
              {!categoryObject ? "Add Category" : "Update"}
            </button>
            {categoryObject && (
              <button
                className="btn w-40 m-t-5"
                style={{ backgroundColor: "yellow", color: "black" }}
                onClick={() => {
                  setCategoryName("");
                  setCategoryObject(null);
                }}
              >
                Clear Category
              </button>
            )}
            <div className="w-100">
              <CategoriesTable
                setCategoryObject={setCategoryObject}
                fetchData={fetchData}
                setCategoryName={setCategoryName}
                data={data}
                isloading={isLoading}
              />
              <div className="flex flex-h-end m-t-20">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        );
      case "thresholdItems":
        return (
          <div className=" gap-16 w-100 border m-t-20">
            <div>
              <div className="w-100 m-t-20 flex">
                <label htmlFor="category" className="label">
                  Category
                </label>
                <select
                  id="category"
                  className="input-field"
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    //   fetchOtherServiceCategory(e.target.value);
                    // setServiceId(1);
                  }}
                >
                  <option value="select">Select Category</option>
                  {data?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-t-20">
                <InputField
                  onChange={(e) => {
                    setsubCategoryName(e.target.value);
                  }}
                  value={subCategoryName}
                  label="Service Name"
                  name="serviceName"
                  type="text"
                />
              </div>
              <button
                className="btn w-40 m-t-5"
                onClick={!categoryObject ? addService : editService}
              >
                {!serviceObject ? "Add Service" : "Update"}
              </button>
              {serviceObject && (
                <button
                  className="btn w-40 m-t-5"
                  style={{ backgroundColor: "yellow", color: "black" }}
                  onClick={() => {
                    setsubCategoryName("");
                    setserviceObject(null);
                    setSelectedCategoryId("");
                  }}
                >
                  Clear Category
                </button>
              )}
            </div>
            <div className="w-100">
              <ServiceTable
                setserviceObject={setserviceObject}
                fetchData={fetchServices}
                setsubCategoryName={setsubCategoryName}
                setSelectedCategoryId={setSelectedCategoryId}
                data={categories}
                isloading={isLoading}
              />
              <div className="flex flex-h-end m-t-20">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className=" gap-16 w-100 border m-t-20">
            <div className="m-t-20">
              <InputField
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
                value={categoryName}
                label="Category Name"
                name="categoryName"
                type="text"
              />
            </div>

            <button
              className="btn w-40 m-t-5"
              onClick={!categoryObject ? addCategory : editCategory}
            >
              {!categoryObject ? "Add Category" : "Update"}
            </button>
            {categoryObject && (
              <button
                className="btn w-40 m-t-5"
                style={{ backgroundColor: "yellow", color: "black" }}
                onClick={() => {
                  setCategoryName("");
                  setCategoryObject(null);
                }}
              >
                Clear Category
              </button>
            )}
            <div className="w-100">
              <CategoriesTable
                setCategoryObject={setCategoryObject}
                fetchData={fetchData}
                setCategoryName={setCategoryName}
                data={data}
                isloading={isLoading}
              />
              <div className="flex flex-h-end m-t-20">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const fetchData = async (page, size) => {
    setIsLoading(true);
    try {
      const response = await get(`/category/list/${page}/${size}/`);
      setData(response.resultList);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const addCategory = async () => {
    console.log(categoryName);
    let payload = {
      name: categoryName,
      userId: +localStorage.getItem("userId"),
    };
    console.log(payload);

    // return;
    try {
      const response = await posts(`/category`, payload);
      fetchData(currentPage, pageSize);

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const editCategory = async () => {
    console.log(categoryName);
    let payload = {
      name: categoryName,
      userId: +localStorage.getItem("userId"),
    };
    console.log(payload);

    // return;
    try {
      const response = await puts(`/category/${categoryObject?.id}`, payload);
      //   const response = await put(`/category`);
      fetchData(currentPage, pageSize);

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
    fetchServices();
    // fetchOtherServiceCategory();
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchOtherServiceCategory = async (id) => {
    // https://edogoverp.com/clinicapi/api/categoryitem/list/category/8/1/10
    try {
      const response = await get(`/categoryItem/list/category/${id}/1/1000`);
      //   setEquipmentServicecategories
      // setBedServicecategories
      setcategories(response.resultList);
      console.log(response.resultList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async (id) => {
    // https://edogoverp.com/clinicapi/api/categoryitem/list/category/8/1/10
    try {
      const response = await get(`/categoryItem/list/1/1000`);
      //   setEquipmentServicecategories
      // setBedServicecategories
      setcategories(response.resultList);
      console.log(response.resultList);
    } catch (error) {
      console.log(error);
    }
  };

  const addService = async () => {
    console.log(subCategoryName);
    let payload = {
      itemName: subCategoryName,
      categoryId: +selectedCategoryId,
    };
    console.log(payload);

    // return;
    try {
      const response = await post(`/categoryitem`, payload);
      fetchData(currentPage, pageSize);

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const editService = async () => {
    console.log(categoryName);
    let payload = {
      name: categoryName,
      userId: +localStorage.getItem("userId"),
    };
    console.log(payload);

    return;
    try {
      const response = await put(
        `/categoryitem/${categoryObject?.id}`,
        payload
      );
      //   const response = await put(`/category`);
      fetchData(currentPage, pageSize);

      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteService = async () => {
    console.log(categoryName);
    let payload = {
      name: categoryName,
      userId: +localStorage.getItem("userId"),
    };
    console.log(payload);

    // return;
    try {
      const response = await del(`/categoryitem/${serviceObject?.id}`);
      console.log(response);
      fetchData(currentPage, pageSize);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-100">
      <div className="m-t-20">...</div>
      <div className="flex justify-between">
        <div className="m-t-20 bold-text">Settings</div>
      </div>
      <div className="tabs flex m-t-20 bold-text">
        <div
          className={`tab-item ${selectedTab === "inventory" ? "active" : ""}`}
          onClick={() => setSelectedTab("inventory")}
        >
          Categories Settings
        </div>

        <div
          className={`tab-item ${
            selectedTab === "thresholdItems" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("thresholdItems")}
        >
          Services Settings
        </div>
       
      </div>

      {renderTabContent()}
    </div>
  );
}

export default Settings;
