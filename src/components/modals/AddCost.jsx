import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import { get, post } from '../../utility/fetch';
import toast from 'react-hot-toast';

function AddCost({ closeModal, fetchData }) {
    const [carePlan, setCarePlan] = useState('');

    const [itemName, setitemName] = useState('');
    const [loading, setLoading] = useState(false);
    const [itemId, setItemId] = useState('');
    const [unitCost, setUnitCost] = useState('');
    const [categories, setcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(1);

    const [itemNameError, setItemNameError] = useState(null);
    const [itemIdError, setItemIdError] = useState(null);
    const [unitCostError, setUnitCostError] = useState(null);
    const [generalError, setGeneralError] = useState(null);

    const fetchTreatmentCategory = async () => {
        try {
            const response = await get('/category/list/1/1000');
            setcategories(response.resultList);
        } catch (error) {
            console.log(error);
        }
    };

    const submit = async () => {
        setLoading(true);

        // Clear previous errors
        setItemNameError(null);
        setItemIdError(null);
        setUnitCostError(null);
        setGeneralError(null);

        const payload = {
            categoryId: parseInt(selectedCategoryId) || 0,
            itemName: itemName,
            itemId: parseInt(itemId) || 0,
            unitCost: parseFloat(unitCost) || 0,
        };

        try {
            const response = await post("/costsetup", payload);
            toast.success("Item Added Successfully");
            fetchData();
            closeModal();
        } catch (e) {
            const errorData = await e.response?.json();
            if (Array.isArray(errorData?.errorData)) {
                errorData.errorData.forEach(errorMessage => {
                    if (errorMessage.includes("Item Name")) {
                        setItemNameError(errorMessage);
                    } else if (errorMessage.includes("Item Id")) {
                        setItemIdError(errorMessage);
                    } else if (errorMessage.includes("Unit Cost")) {
                        setUnitCostError(errorMessage);
                    } else {
                        setGeneralError(errorMessage);
                    }
                });
            } else if (typeof errorData === 'string') {
                setGeneralError(errorData);
            } else {
                setGeneralError("An unexpected error occurred.");
            }
            toast.error("Something went wrong");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTreatmentCategory();
    }, []);

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Add Item</h3>
                    <div className="w-100 m-t-20 flex">
                        <label htmlFor="category" className='label'>Category</label>
                        <select id="category" className="input-field" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <InputField
                        label="Item Name"
                        value={itemName}
                        onChange={(e) => setitemName(e.target.value)}
                    />
                    {itemNameError && <span className="error-message">{itemNameError}</span>}

                    <InputField
                        label="Item #ID"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        type="number"
                    />
                    {itemIdError && <span className="error-message">{itemIdError}</span>}

                    <InputField
                        label="Unit Cost"
                        value={unitCost}
                        onChange={(e) => setUnitCost(e.target.value)}
                        type="number"
                    />
                    {unitCostError && <span className="error-message">{unitCostError}</span>}

                    {generalError && <span className="error-message">{generalError}</span>}

                    <button className="btn m-t-20 w-100" onClick={submit} disabled={loading}>Continue</button>
                </div>
            </div>
        </div>
    );
}

export default AddCost;
