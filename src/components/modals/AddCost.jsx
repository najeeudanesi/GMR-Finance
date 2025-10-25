import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import InputField from "../UI/InputField";
import { get, post, put } from "../../utility/fetch";
import toast from "react-hot-toast";

function AddCost({ closeModal, fetchData, modalData, currentPage }) {
  const [carePlan, setCarePlan] = useState("");
  const [itemName, setItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemId, setItemId] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [EquipmentServicecategories, setEquipmentServicecategories] = useState(
    []
  );
  const [BedServicecategories, setBedServicecategories] = useState([]);
  const [OtherServicecategories, setOtherServicecategories] = useState([]);

  function generateRandomNumber(min, max) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Function specifically for your requested range (1 to 1,000,000)
  function generateRandomNumberBetween1AndMillion() {
    return generateRandomNumber(1, 1000000);
  }

  useEffect(() => {
    fetchTreatmentCategory();
    fetchEquipmentServiceCategory();
    fetchBedServiceCategory();
    fetchOtherServiceCategory(modalData?.serviceId || 0);

    // Populate form fields if modalData is provided (edit mode)
    if (modalData) {
      setSelectedCategoryId(modalData.category.id || "");
      setServiceId(modalData.serviceId || "");
      setUnitCost(modalData.unitCost || "");
    }
  }, [modalData]);

  console.log("Modal Data: ", modalData);

  const fetchTreatmentCategory = async () => {
    try {
      const response = await get("/category/list/1/1000");
      setCategories(response.resultList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEquipmentServiceCategory = async () => {
    try {
      const response = await get("/equipment/list/1/1000");
      setEquipmentServicecategories(response.resultList);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOtherServiceCategory = async (id) => {
    try {
      const response = await get(`/categoryItem/list/category/${id}/1/1000`);
      setOtherServicecategories(response.resultList);
    } catch (error) {
      setOtherServicecategories([]);
      console.log(error);
    }
  };

  const fetchBedServiceCategory = async () => {
    try {
      const response = await get("/bed/list/1/1000");
      setBedServicecategories(response.resultList);
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {
    setLoading(true);

    const payload = {
      isCategoryItem:
        selectedCategoryId &&
        selectedCategoryId !== 8 &&
        selectedCategoryId !== 9,
      isBed: selectedCategoryId == 8,
      isEquipment: selectedCategoryId == 9,
      serviceId: parseInt(serviceId),
      categoryId: parseInt(selectedCategoryId) || 0,
      unitCost: parseFloat(unitCost) || 0,
    };

    try {
      if (modalData) {
        // Update existing cost
        await put(`/costsetup/${modalData.id}`, {
          ...payload,
          itemId: parseInt(serviceId),
        });
        toast.success("Cost updated successfully");
      } else {
        // Add new cost
        await post("/costsetup", { ...payload, itemId: parseInt(serviceId) });
        toast.success("Cost added successfully");
      }

      fetchData(currentPage, 10); // Refresh the data in the parent component
      closeModal();
    } catch (error) {
      console.error("Error submitting cost:", error);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="overlay">
      <RiCloseFill className="close-btn pointer" onClick={closeModal} />
      <div className="modal-box max-w-600">
        <div className="p-20">
          <h3 className="bold-text">{modalData ? "Edit Cost" : "Add Cost"}</h3>
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
                fetchOtherServiceCategory(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-100 m-t-20 flex">
            <label htmlFor="serviceId" className="label">
              Service
            </label>
            <select
              id="serviceId"
              className="input-field"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">Select Service</option>
              {OtherServicecategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.itemName}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Unit Cost"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            type="number"
          />

          <button
            className="btn m-t-20 w-100"
            onClick={submit}
            disabled={loading}
          >
            {modalData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCost;
