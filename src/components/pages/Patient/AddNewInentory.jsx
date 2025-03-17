import { useEffect, useState } from "react";
import FileInput from "../../UI/FileInput";
import InputField from "../../UI/InputField";
import TextField from "../../UI/TextField";
import { get, post } from "../../../utility/fetch";
import { formatDate } from "../../../utility/general";
import { format } from "date-fns";
const AddNewInventory = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [categories, setcategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: 0,
    productName: "string",
    quantity: 0,
    thresholdLimit: 0,
    inventoryNumber: "string",
    mfgBatchNumber: "string",
    bestBefore: "31-10-2011",
    manufacturer: "string",
    costPrice: 0,
    sellingPrice: 0,
    description: "string",
    dosage: "string",
    dateSupplied: "31-7-2050",
    supplier: "string",
    ingredient: "string",
    cautions: "string",
    howToUseIt: "string",
    productPicture: "string",
    productBarcode: "string",
  });
  const fetchTreatmentCategory = async () => {
    try {
      const response = await get("/category/list/1/1000");
      setcategories(response.resultList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTreatmentCategory();
  }, []);

  const handleChange = (event) => {
    console.log(event.target.name);
    console.log(event.target.value);
    const { name, value, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "number"
          ? +value
          : type === "date"
          ? format(new Date(value), "dd-MM-yyyy")
          : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async () => {
    console.log(formData);
    // return
    try {
      const requestBody = {
        productName: "string",
        quantity: 0,
        thresholdLimit: 0,
        inventoryNumber: "string",
        mfgBatchNumber: "string",
        bestBefore: "31-10-2011",
        manufacturer: "string",
        costPrice: 0,
        sellingPrice: 0,
        description: "string",
        dosage: "string",
        dateSupplied: "31-7-2050",
        supplier: "string",
        ingredient: "string",
        cautions: "string",
        howToUseIt: "string",
        ...formData,
        categoryId: +selectedCategoryId,

        productPicture: '',
        // formData.productPicture
          // ? URL.createObjectURL(formData.productPicture)
          // : null,
        productBarcode: '',
        // formData.productPicture
          // ? URL.createObjectURL(formData.productBarcode)
          // : null,
      };

      console.log(requestBody);

      await post(`/pharmacyinventory/inventory`, requestBody);
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
          <div className="flex justify-between space-x-2">
            <select
              id="categoryId"
              className="input-field"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <InputField
            onChange={handleChange}
            label="Product Name"
            name="productName"
            type="text"
          />

          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Manufacturer"
              name="manufacturer"
              type="text"
            />

            <InputField
              onChange={handleChange}
              label="Quantity"
              name="quantity"
              type="number"
            />
            <InputField
              onChange={handleChange}
              label="Threshold Limit"
              name="thresholdLimit"
              type="number"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Inventory Id"
              name="inventoryNumber"
              type="text"
            />
            <InputField
              onChange={handleChange}
              label="Manufacturer Number"
              name="mfgBatchNumber"
              type="text"
            />
            <InputField
              onChange={handleChange}
              label="Supplier"
              name="supplier"
              type="text"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Date Supplied"
              name="dateSupplied"
              type="date"
            />
            <InputField
              onChange={handleChange}
              label="Ingredent"
              name="ingredient"
              type="text"
            />

            <InputField
              onChange={handleChange}
              label="Dosage"
              name="dosage"
              type="text"
            />
          </div>
          <TextField
            onChange={handleChange}
            label="Caution"
            name="cautions"
            type="textarea"
          />
          <TextField
            onChange={handleChange}
            label="How to use it"
            name="howToUseIt"
            type="textarea"
          />
          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Best Before"
              name="bestBefore"
              type="date"
            />

            <InputField
              onChange={handleChange}
              label="Cost Price"
              name="costPrice"
              type="number"
            />
            <InputField
              onChange={handleChange}
              label="Selling Price"
              name="sellingPrice"
              type="number"
            />
          </div>
          <TextField
            label="Product Description Overview"
            name="description"
            type="textarea"
            onChange={handleChange}
          />
        </div>

        {/* <div className="flex justify-between flex-col m-5">
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
        </div> */}
      </div>
      <div className="m-t-20">
        <button className="btn w-40" onClick={handleSubmit}>
          Add Inventory
        </button>
      </div>
    </div>
  );
};

export default AddNewInventory;
