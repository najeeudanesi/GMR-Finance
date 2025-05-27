import { useEffect, useState } from "react";
import FileInput from "../../UI/FileInput";
import InputField from "../../UI/InputField";
import TextField from "../../UI/TextField";
import { get, post } from "../../../utility/fetch";
import { formatDate } from "../../../utility/general";
import { format } from "date-fns";
import SelectField from "../../UI/SelectField";
import SelectField2 from "../../UI/SelectField copy";
const AddNewInventory = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [categories, setcategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: 0,
    productName: "",
    productGenericName: "", // Added
    drugCategory: "", // Added
    strength: "", // Added
    measurementUnit: "", // Added
    mass: "", // Added
    quantity: 0,
    thresholdLimit: 0,
    inventoryNumber: "",
    mfgBatchNumber: "",
    bestBefore: "",
    manufacturer: "",
    costPrice: 0,
    sellingPrice: 0,
    description: "",
    dosage: "",
    dateSupplied: "",
    supplier: "",
    ingredient: "",
    cautions: "",
    howToUseIt: "",
    productPicture: "",
    productBarcode: "",
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

  const dosageForms = [
    { id: 'milligrams', label: 'Milligrams' },
    { id: 'grams', label: 'Grams' },
    { id: 'micrograms', label: 'Micrograms' },
    { id: 'milliliters', label: 'Milliliters' },
    { id: 'liters', label: 'Liters' },
    { id: 'units', label: 'Units' },
    { id: 'puffs', label: 'Puffs' },
    { id: 'sprays', label: 'Sprays' },
    { id: 'drops', label: 'Drops' },
    { id: 'patch', label: 'Patch' },
    { id: 'bottle', label: 'Bottle' },
    { id: 'system', label: 'Transdermal System' },
    { id: 'tablet', label: 'Tablet' },
    { id: 'capsule', label: 'Capsule' },
    { id: 'suppository', label: 'Suppository' },
    { id: 'scoop', label: 'Scoop' },
    { id: 'sachet', label: 'Sachet' },
    { id: 'ampoule', label: 'Ampoule' },
    { id: 'vial', label: 'Vial' },
    { id: 'pen', label: 'Injection Pen' },
    { id: 'enema', label: 'Enema' },
    { id: 'ounces', label: 'Ounces' },
    { id: 'teaspoon', label: 'Teaspoon' },
    { id: 'tablespoon', label: 'Tablespoon' },
    { id: 'milliequivalents', label: 'Milliequivalents' },
    { id: 'internationalUnits', label: 'International Units' }
  ];
  
  
  const drugTypes = [
    { id: 'Tablets', label: 'Tablets' },
    { id: 'Capsules', label: 'Capsules' },
    { id: 'Ampules', label: 'Ampules' },
    { id: 'Vials', label: 'Vials' },
    { id: 'Syringes', label: 'Syringes' },
    { id: 'Suppositories', label: 'Suppositories' },
    { id: 'Ointments', label: 'Ointments' },
    { id: 'Creams', label: 'Creams' },
    { id: 'Inhalers', label: 'Inhalers' },
    { id: 'Patches (Transdermal)', label: 'Patches (Transdermal)' },
    { id: 'Powders', label: 'Powders' },
    { id: 'Drops (Ophthalmic/Otic)', label: 'Drops (Ophthalmic/Otic)' },
    { id: 'Solutions', label: 'Solutions' },
    { id: 'Suspensions', label: 'Suspensions' },
    { id: 'Lozenges', label: 'Lozenges' },
    { id: 'Liquids (Oral)', label: 'Liquids (Oral)' },
    { id: 'Emulsions', label: 'Emulsions' },
    { id: 'Gels', label: 'Gels' },
    { id: 'Sprays', label: 'Sprays' },
    { id: 'Pens (Injectables)', label: 'Pens (Injectables)' },
    { id: 'Sachets', label: 'Sachets' },
    { id: 'Nebules (for Nebulizers)', label: 'Nebules (for Nebulizers)' },
    { id: 'Buccal Films', label: 'Buccal Films' },
    { id: 'Transdermal Systems', label: 'Transdermal Systems' },
    { id: 'Granules', label: 'Granules' },
    { id: 'Implants', label: 'Implants' },
    { id: 'Mouthwash/Rinse', label: 'Mouthwash/Rinse' },
    { id: 'Foam', label: 'Foam' },
    { id: 'Enemas', label: 'Enemas' },
    { id: 'Nasal Spray', label: 'Nasal Spray' }
  ];
  


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
    try {
      const requestBody = {
        ...formData,
        categoryId: +selectedCategoryId,
      };

      console.log(requestBody);

      await post(`/pharmacyinventory/inventory`, requestBody);

      // Reset formData to its initial state
      setFormData({
        categoryId: 0,
        productName: "",
        productGenericName: "",
        drugCategory: "",
        strength: "",
        measurementUnit: "",
        mass: "",
        quantity: 0,
        thresholdLimit: 0,
        mfgBatchNumber: "",
        bestBefore: "",
        manufacturer: "",
        costPrice: 0,
        sellingPrice: 0,
        description: "",
        dosage: "",
        dateSupplied: "",
        supplier: "",
        ingredient: "",
        cautions: "",
        howToUseIt: "",
        productPicture: "",
        productBarcode: "",
      });

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
          <SelectField2
            onChange={handleChange}
            label="Drug Type"
            name="drugCategory"
            options={drugTypes}
            value={formData.drugCategory}
            type="select"
          />
          <InputField
            onChange={handleChange}
            label="Brand Name"
            value={formData.productName}
            name="productName"
            type="text"
          />
          <InputField
            onChange={handleChange}
            label="Generic Name"
            value={formData.productGenericName}
            name="productGenericName"
            type="text"
          />

          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              type="text"
            />

            <InputField
              onChange={handleChange}
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              type="number"
            />
            <InputField
              onChange={handleChange}
              label="Threshold Limit"
              name="thresholdLimit"
              value={formData.thresholdLimit}
              type="number"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Strength/Concentration"
              name="strength"
              value={formData.strength}
              type="text"
            />
            <InputField
              onChange={handleChange}
              label="Manufacturer Number"
              name="mfgBatchNumber"
              value={formData.mfgBatchNumber}
              type="text"
            />
            <InputField
              onChange={handleChange}
              label="Supplier"
              name="supplier"
              value={formData.supplier}
              type="text"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Mass"
              name="mass"
              value={formData.mass}
              type="text"
            />
            <InputField
              onChange={handleChange}
              label="Date Supplied"
              name="dateSupplied"
              type="date"
            />
            <InputField
              onChange={handleChange}
              label="Form"
              name="ingredient"
              value={formData.ingredient}
              type="text"
            />

          </div>
          <div className="flex justify-between space-x-2">

            <InputField
              onChange={handleChange}
              label="Dosage"
              name="dosage"
              value={formData.dosage}
              type="text"
            />
            <SelectField2
              onChange={handleChange}
              label="Unit"
              name="measurementUnit"
              options={dosageForms}
              value={formData.measurementUnit}
              type="select"
            />
          </div>
          <TextField
            onChange={handleChange}
            label="Caution"
            name="cautions"
            value={formData.cautions}
            type="textarea"
          />
          <TextField
            onChange={handleChange}
            label="How to use it"
            name="howToUseIt"
            value={formData.howToUseIt}
            type="textarea"
          />
          <div className="flex justify-between space-x-2">
            <InputField
              onChange={handleChange}
              label="Expiry Date"
              name="bestBefore"
              type="date"
            />

            <InputField
              onChange={handleChange}
              label="Cost Price"
              name="costPrice"
              value={formData.costPrice}
              type="number"
            />
            <InputField
              onChange={handleChange}
              label="Selling Price"
              name="sellingPrice"
              value={formData.sellingPrice}
              type="number"
            />
          </div>
          <TextField
            label="Product Description Overview"
            name="description"
            value={formData.description}
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
