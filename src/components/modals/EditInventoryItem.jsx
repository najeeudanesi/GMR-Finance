import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import FileInput from '../UI/FileInput';
import TextField from '../UI/TextField';
import InputField from '../UI/InputField';
import DateInput from '../UI/DateInput';
import toast from 'react-hot-toast';
import { get, put } from '../../utility/fetch';
import { useNavigate } from 'react-router-dom';

const EditInventoryItem = ({ closeModal, data }) => {
    const [formData, setFormData] = useState({
        id: "",
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

    useEffect(() => {
        if (data) {
            setFormData({
                id: data.id || "",
                productName: data.productName || "",
                quantity: data.availableQuantity || "",
                inventoryNumber: data.inventoryNumber || "",
                manufacturer: data.manufacturer || "",
                bestBefore: formatDate(data.bestBefore),
                dateSupplied: formatDate(data.dateSupplied),
                costPrice: data.costPrice || "",
                sellingPrice: data.sellingPrice || "",
                description: data.description || "",
                productPicture: data.productPicture || "",
                productBarcode: data.productBarcode || "",
                categoryId: data.categoryId || "",
                thresholdLimit: data.thresholdLimit || "",
                mfgBatchNumber: data.mfgBatchNumber || "",
                dosage: data.dosage || "",
                supplier: data.supplier || "",
                ingredient: data.ingredient || "",
                cautions: data.cautions || "",
                howToUseIt: data.howToUseIt || "",
            });
        }
    }, [data]);

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
        } else {
            setFormData({ ...formData, [name]: "" });
        }
    };

    const validateForm = () => {
        if (!formData.productName || !formData.categoryId || !formData.quantity) {
            toast.error("Please fill in all required fields.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;


        const payload = {

            productName: formData.productName || "",
            quantity: Number(formData.quantity) || "",
            inventoryNumber: formData.inventoryNumber || "",
            manufacturer: formData.manufacturer || "",
            bestBefore: formatDate(formData.bestBefore),
            dateSupplied: formatDate(formData.dateSupplied),
            costPrice: Number(formData.costPrice) || "",
            sellingPrice: Number(formData.sellingPrice) || "",
            description: formData.description || "",
            productPicture: formData.productPicture || "",
            productBarcode: formData.productBarcode || "",
            categoryId: Number(formData.categoryId) || "",
            thresholdLimit: formData.thresholdLimit || "",
            mfgBatchNumber: formData.mfgBatchNumber || "",
            dosage: formData.dosage || "",
            supplier: formData.supplier || "",
            ingredient: formData.ingredient || "",
            cautions: formData.cautions || "",
            howToUseIt: formData.howToUseIt || "",
        }

        try {

            await put(`/pharmacyinventory/${data?.id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success("Inventory updated successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error updating inventory:", error);
            toast.error("Failed to update inventory");
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-1000">
                <div className="p-40">
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
                                <InputField label="Product Name" name="productName" type="text" value={formData.productName} onChange={handleChange} />
                                <InputField label="Quantity" name="quantity" type="text" value={formData.quantity} onChange={handleChange} />
                                <div className="flex justify-between space-x-2">
                                    <InputField label="Inventory Number" name="inventoryNumber" type="text" value={formData.inventoryNumber} onChange={handleChange} />
                                    <InputField label="Manufacturer" name="manufacturer" type="text" value={formData.manufacturer} onChange={handleChange} />
                                </div>
                                <div className="flex justify-between space-x-2">
                                    <DateInput label="Best Before" name="bestBefore" type="date" value={formData.bestBefore} onChange={handleChange} />
                                    <DateInput label="Date Supplied" name="dateSupplied" type="date" value={formData.dateSupplied} onChange={handleChange} />
                                </div>
                                <InputField label="Mfg Batch Number" name="mfgBatchNumber" type="text" value={formData.mfgBatchNumber} onChange={handleChange} />
                                <div className="flex justify-between space-x-2">
                                    <InputField label="Cost Price" name="costPrice" type="text" value={formData.costPrice} onChange={handleChange} />
                                    <InputField label="Selling Price" name="sellingPrice" type="text" value={formData.sellingPrice} onChange={handleChange} />
                                </div>
                                <div className="flex justify-between space-x-2">
                                    <InputField label="Dosage" name="dosage" type="text" value={formData.dosage} onChange={handleChange} />
                                    <InputField label="Threshold Limit" name="thresholdLimit" type="text" value={formData.thresholdLimit} onChange={handleChange} />
                                </div>
                                <div className="flex justify-between space-x-2">
                                    <InputField label="Supplier" name="supplier" type="text" value={formData.supplier} onChange={handleChange} />
                                    <InputField label="Ingredient" name="ingredient" type="text" value={formData.ingredient} onChange={handleChange} />
                                </div>
                                <TextField label="Cautions" name="cautions" type="textarea" value={formData.cautions} onChange={handleChange} />
                                <TextField label="How to Use It" name="howToUseIt" type="textarea" value={formData.howToUseIt} onChange={handleChange} />
                                <TextField label="Product Description Overview" name="description" type="textarea" value={formData.description} onChange={handleChange} />
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
                                Update Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditInventoryItem;
