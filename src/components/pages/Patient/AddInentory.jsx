import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { get, post } from "../../../utility/fetch";
import DateInput from "../../UI/DateInput";
import FileInput from "../../UI/FileInput";
import InputField from "../../UI/InputField";
import TextField from "../../UI/TextField";
import { useNavigate } from "react-router-dom";

const AddInventory = () => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    inventoryNumber: "",
    manufacturer: "",
    bestBefore: "",
    dateSupplied: "",
    costPrice: "",
    sellingPrice: "",
    description: "",
    productPicture: "",
    productBarcode: "",
    categoryId: "",
    thresholdLimit: "",
    mfgBatchNumber: "",
    dosage: "",
    supplier: "",
    ingredient: "",
    cautions: "",
    howToUseIt: "",
  });

  const router = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await get("/category/list/1/1000");
      setCategories(response.resultList || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      const requestBody = {
        categoryId: parseInt(formData.categoryId) || 0,
        productName: formData.productName,
        quantity: parseInt(formData.quantity, 10) || 0,
        thresholdLimit: parseInt(formData.thresholdLimit, 10) || 0,
        inventoryNumber: formData.inventoryNumber,
        mfgBatchNumber: formData.mfgBatchNumber || "",
        // Format the dates when constructing the payload
        bestBefore: formatDate(formData.bestBefore),
        dateSupplied: formatDate(formData.dateSupplied),
        manufacturer: formData.manufacturer,
        costPrice: parseFloat(formData.costPrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        description: formData.description,
        dosage: formData.dosage || "",
        supplier: formData.supplier || "",
        ingredient: formData.ingredient || "",
        cautions: formData.cautions || "",
        howToUseIt: formData.howToUseIt || "",
        productPicture: formData.productPicture
          ? URL.createObjectURL(formData.productPicture)
          : "",
        productBarcode: formData.productBarcode,
      };

      await post("/pharmacyinventory/inventory", requestBody);
      toast.success("Inventory added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding inventory:", error);
      toast.error("Failed to add inventory");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };


  return (
    <div className="w-100">
      <div className="flex justify-between">
        <div>
          <div className="w-100 m-t-20 flex">
            <label htmlFor="category" className="label">
              Category
            </label>
            <select
              id="category"
              className="input-field"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <InputField label="Product Name" name="productName" type="text" onChange={handleChange} />
          <InputField label="Quantity" name="quantity" type="text" onChange={handleChange} />
          <div className="flex justify-between space-x-2">
            <InputField label="Inventory Number" name="inventoryNumber" type="text" onChange={handleChange} />
            <InputField label="Manufacturer" name="manufacturer" type="text" onChange={handleChange} />
          </div>
          <div className="flex justify-between space-x-2">

            <DateInput label="Best Before" name="bestBefore" type="date" onChange={handleChange} value={formData.bestBefore} />
            <DateInput label="Date Supplied" name="dateSupplied" type="date" onChange={handleChange} value={formData.dateSupplied} />
          </div>
          <InputField label="Mfg Batch Number" name="mfgBatchNumber" type="text" onChange={handleChange} />
          <div className="flex justify-between space-x-2">
            <InputField label="Cost Price" name="costPrice" type="text" onChange={handleChange} />
            <InputField label="Selling Price" name="sellingPrice" type="text" onChange={handleChange} />
          </div>
          <div className="flex justify-between space-x-2">
            <InputField label="Dosage" name="dosage" type="text" onChange={handleChange} />
            <InputField label="Threshold Limit" name="thresholdLimit" type="text" onChange={handleChange} />
          </div>
          <div className="flex justify-between space-x-2">
            <InputField label="Supplier" name="supplier" type="text" onChange={handleChange} />
            <InputField label="Ingredient" name="ingredient" type="text" onChange={handleChange} />
          </div>
          <TextField label="Cautions" name="cautions" type="textarea" onChange={handleChange} />
          <TextField label="How to Use It" name="howToUseIt" type="textarea" onChange={handleChange} />
          <TextField label="Product Description Overview" name="description" type="textarea" onChange={handleChange} />

        </div>

        <div className="flex justify-between flex-col m-5">
          <FileInput
            name="productPicture"
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            onChange={handleFileChange}
          />
          <FileInput
            name="productBarcode"
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="m-t-20">
        <button className="btn w-40" onClick={handleSubmit}>
          Add Inventory
        </button>
      </div>
    </div>
  );
};

export default AddInventory;
