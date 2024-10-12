import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import { get, put } from '../../utility/fetch'; // Assuming `put` is used for updating
import toast from 'react-hot-toast';
import TextArea from '../UI/TextArea';

function EditBenefit({ closeModal, fetchData, id, packageId, benefit }) {
    const [benefitProvision, setBenefitProvision] = useState(benefit.benefitProvision || '');
    const [benefitLimit, setBenefitLimit] = useState(benefit.benefitLimit || '');
    const [limitAmount, setLimitAmount] = useState(benefit.limitAmount || '');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(benefit.categoryId || 0);

    const [benefitProvisionError, setBenefitProvisionError] = useState(null);
    const [benefitLimitError, setBenefitLimitError] = useState(null);
    const [limitAmountError, setLimitAmountError] = useState(null);
    const [generalError, setGeneralError] = useState(null);

    const fetchTreatmentCategory = async () => {
        try {
            const response = await get('/category/list/1/1000');
            const categories = response.resultList;
            setCategories(categories);


            if (benefit.category) {
                const matchedCategory = categories.find(category => category.id === benefit?.category?.id);
                setSelectedCategoryId(matchedCategory ? matchedCategory.id : categories[0]?.id || 0);

            } else {
                setSelectedCategoryId(categories[0]?.id || 0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submit = async () => {
        setLoading(true);

        // Clear previous errors
        setBenefitProvisionError(null);
        setBenefitLimitError(null);
        setLimitAmountError(null);
        setGeneralError(null);

        const payload = {
            categoryId: parseInt(selectedCategoryId) || 0,
            benefitProvision: benefitProvision,
            benefitLimit: benefitLimit,
            limitAmount: parseInt(limitAmount) || 0,
        };

        try {
            await put(`/hmo/package/${packageId}/benefit/${benefit?.id}/update-package-benefit`, payload);
            toast.success("Benefit Updated Successfully");
            fetchData();
            closeModal();
        } catch (e) {

            const errorData = await e?.response?.json();
            if (Array.isArray(errorData?.errorData)) {
                errorData.errorData.forEach(errorMessage => {
                    if (errorMessage.includes("Benefit Provision")) {
                        setBenefitProvisionError(errorMessage);
                    } else if (errorMessage.includes("Benefit Limit")) {
                        setBenefitLimitError(errorMessage);
                    } else if (errorMessage.includes("Limit Amount")) {
                        setLimitAmountError(errorMessage);
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
                    <h3 className="bold-text">Edit Benefit</h3>
                    <div className="w-100 m-t-20 flex">
                        <label htmlFor="category" className='label'>Category</label>
                        <select id="category" className="input-field" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    <TextArea
                        label="Benefit Provision"
                        value={benefitProvision}
                        onChange={(e) => setBenefitProvision(e.target.value)}
                    />
                    {benefitProvisionError && <span className="error-message">{benefitProvisionError}</span>}

                    <InputField
                        label="Benefit Limit"
                        value={benefitLimit}
                        onChange={(e) => setBenefitLimit(e.target.value)}
                    />
                    {benefitLimitError && <span className="error-message">{benefitLimitError}</span>}

                    <InputField
                        label="Limit Amount"
                        value={limitAmount}
                        onChange={(e) => setLimitAmount(e.target.value)}
                        type="number"
                    />
                    {limitAmountError && <span className="error-message">{limitAmountError}</span>}

                    {generalError && <span className="error-message">{generalError}</span>}

                    <button className="btn m-t-20 w-100" onClick={submit} disabled={loading}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default EditBenefit;
