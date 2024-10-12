import React, { useEffect, useState } from 'react';
import PackageTable from '../../tables/PackageTable';
import InputField from '../../UI/InputField';
import { get, post } from '../../../utility/fetch';
import toast from 'react-hot-toast';
import PackageDetailsTable from '../../tables/PackageDetailsTable';
import add from "../../../assets/svg/add.svg"
import remove from "../../../assets/svg/remove.svg"
import AddBenefit from '../../modals/AddBenefit';

function Packages({ data, id, fetchData }) {
    const [packageName, setPackageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [benefits, setBenefits] = useState([]);
    const [modal, setModal] = useState(false);
    const [showAddPackage, setShowAddPackage] = useState(false); // State to toggle between add and remove

    const addPackage = async () => {
        setLoading(true);
        try {
            const response = await post(`/hmo/${id}/add-package`, { name: packageName });
            toast.success("Package Added Successfully");
            console.log(response);
            setPackageName("")
            fetchData(); // Refresh the data after adding the package
        } catch (error) {
            const errMessage = await error.response?.json();
            toast.error(errMessage?.errorData[0] || "Something went wrong");
            console.log(errMessage);
        }
        setLoading(false);
    };

    const selectPackage = (packageId) => {
        const selected = data.find(pkg => pkg.id === packageId);
        setSelectedPackage(selected);
        setBenefits(selected?.packageBenefits || []);
    };

    useEffect(() => {
        if (data) {
            setSelectedPackage(data?.[0] || null);
        }
    }, [data]);

    return (
        <div className='w-100 flex space-between'>
            <div className='w-25'>
                {/* // Add Packages */}
                <div className='w-100 flex flex-h-end'>
                    {
                        !showAddPackage ? (
                            <img src={add} className='pointer' alt="add" onClick={() => setShowAddPackage(true)} />
                        ) : (
                            <img src={remove} className='pointer' alt="remove" onClick={() => setShowAddPackage(false)} />
                        )
                    }

                </div>

                {showAddPackage && (
                    <div>
                        <InputField label="Package Name" value={packageName} onChange={(e) => setPackageName(e.target.value)} />
                        <button className="btn m-t-20 w-100" disabled={loading} onClick={addPackage}>Add Package</button>
                    </div>
                )}

                {/* // Package Table */}

                <PackageTable data={data} selectPackage={selectPackage} />
            </div>
            <div className='w-60'>
                <div className='w-100 flex flex-h-end'>
                    <img src={add} className='pointer' alt="add" onClick={() => setModal(true)} />
                </div>
                <div className='m-t-20'>
                    <PackageDetailsTable data={selectedPackage?.packageBenefits} fetchData={fetchData} id={id} packageId={selectedPackage?.id} />
                </div>

            </div>

            {modal && (
                <AddBenefit
                    closeModal={() => setModal(false)}
                    fetchData={fetchData}
                    id={id}
                    packageId={selectedPackage?.id}

                />
            )}
        </div>

    );
}

export default Packages;
