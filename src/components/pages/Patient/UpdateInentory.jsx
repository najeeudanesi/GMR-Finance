import React, { useState } from "react";
import { put } from "../../../utility/fetch";
import FileInput from "../../UI/FileInput";
import InputField from "../../UI/InputField";
import TextField from "../../UI/TextField";

const UpdateInventory = ({ inventoryId }) => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    inventoryNumber: "",
    manufacturer: "",
    bestBefore: "",
    costPrice: "",
    sellingPrice: "",
    description: "",
    productPicture: "",
    productBarcode: ""
  });

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
        categoryId: null, // Or provide a default value
        productName: formData.productName,
        quantity: parseInt(formData.quantity, 10) || 0,
        thresholdLimit: null,
        inventoryNumber: formData.inventoryNumber,
        mfgBatchNumber: null,
        bestBefore: formData.bestBefore,
        manufacturer: formData.manufacturer,
        costPrice: parseFloat(formData.costPrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        description: formData.description,
        dosage: null,
        dateSupplied: null,
        supplier: null,
        ingredient: null,
        cautions: null,
        howToUseIt: null,
        productPicture: formData.productPicture ? URL.createObjectURL(formData.productPicture) : null,
        productBarcode: formData.productBarcode
      };

      await put(`/pharmacyinventory/${inventoryId}`, requestBody);
      alert("Inventory updated successfully");
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update inventory");
    }
  };

  return (
    <div className="w-100">
      <div className="flex justify-between">
        <div>
          <InputField label="Product Name" name="productName" type="text" onChange={handleChange} />
          <InputField label="Quantity" name="quantity" type="text" onChange={handleChange} />
          <div className="flex justify-between space-x-2">
            <InputField label="Inventory Id" name="inventoryNumber" type="text" onChange={handleChange} />
            <InputField label="Manufacturer" name="manufacturer" type="text" onChange={handleChange} />
          </div>
          <InputField label="Best Before" name="bestBefore" type="text" onChange={handleChange} />
          <div className="flex justify-between space-x-2">
            <InputField label="Cost Price" name="costPrice" type="text" onChange={handleChange} />
            <InputField label="Selling Price" name="sellingPrice" type="text" onChange={handleChange} />
          </div>
          <TextField label="Product Description Overview" name="description" type="textarea" onChange={handleChange} />
        </div>

        <div className="flex justify-between flex-col m-5">
          <FileInput name="productPicture" type="file" accept="image/jpg,image/png,image/jpeg" onChange={handleFileChange} />
          <FileInput name="productBarcode" type="file" accept="image/jpg,image/png,image/jpeg" onChange={handleFileChange} />
        </div>
      </div>
      <div className="m-t-20">
        <button className="btn w-40" onClick={handleSubmit}>Update Inventory</button>
      </div>
    </div>
  );
};

export default UpdateInventory;
