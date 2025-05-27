import React, { useState, useEffect } from "react";

import { get, put } from "../../utility/fetch";
import SelectField2 from "../UI/SelectField copy";
import InputField from "../UI/InputField";
import { RiCloseFill } from "react-icons/ri";

const ServiceEditModal = ({ closeModal, data, onSave }) => {
    const [formData, setFormData] = useState({
        categoryId: "",
        itemName: "",
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories when the modal is opened
        const fetchCategories = async () => {
            try {
                const response = await get("/category/list/1/1000");
                setCategories(response.resultList);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();

        // Populate formData with existing data if available
        if (data) {
            setFormData({
                categoryId: data.categoryId || "",
                itemName: data.itemName || "",
            });
        }
    }, [data]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                categoryId: Number(formData.categoryId),
                itemName: formData.itemName,
            };

            console.log("Submitting payload:", payload);

            const response = await put(`/categoryItem/${data?.id}`, payload);
            

            alert("Service updated successfully");
            onSave(); // Callback to refresh parent data
            closeModal(); // Close the modal
        } catch (error) {
            console.error("Error updating service:", error);
            alert("Failed to update service");
        }
    };

    return (
        <div className="overlay">
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />

            <div className="modal-box max-w-800 p-40">
                <h2>Edit Service</h2>
                <div className="form-group">
                    <SelectField2
                        onChange={handleChange}
                        label="Category"
                        name="categoryId"
                        options={categories.map((category) => ({
                            id: category.id,
                            label: category.name,
                        }))}
                        value={formData.categoryId}
                    />
                    <InputField
                        label="Item Name"
                        name="itemName"
                        type="text"
                        value={formData.itemName}
                        onChange={handleChange}
                    />
                </div>
                <div className="modal-actions">
                    <button className="btn" onClick={handleSubmit}>
                        Save
                    </button>
                    <button className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceEditModal;