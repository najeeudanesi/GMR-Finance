import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";
import edit from "../../assets/svg/edit.svg";
import delet from "../../assets/svg/delete.svg";
import { del } from "../../utility/fetch";
import toast from "react-hot-toast";
import ConfirmationModal from "../modals/ConfirmationModal";
import EditBenefit from "../modals/EditBenefit";


function PackageDetailsTable({ data, fetchData, id, packageId }) {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [benefitIdToDelete, setBenefitIdToDelete] = useState(null);
    const [benefit, setBenefit] = useState({})

    const deleteBenefit = async (benefitId) => {
        setLoading(true);
        try {
            await del(`/hmo/package-benefit/${benefitId}`);
            toast.success("Benefit Deleted Successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete benefit");
            console.log(error);
        }
        setLoading(false);
    };

    const handleDeleteClick = (benefitId) => {
        setBenefitIdToDelete(benefitId);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        deleteBenefit(benefitIdToDelete);
        setIsModalOpen(false);
    };

    const selectBenefit = (benefit) => {
        setBenefit(benefit)
        setIsEdit(true)
    }

    const navigate = useNavigate();

    return (
        <div className="w-100 h-full">
            <div className="w-100 none-flex-item">
                <table className="bordered-table-skeleton">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th className="w-10">S/N</th>
                            <th>Category</th>
                            <th>Benefit Provision</th>
                            <th>Benefit Limit </th>
                            <th>Benefit Limit Amount(N)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row?.category?.name}</td>
                                <td>{row?.benefitProvision}</td>
                                <td>{row?.benefitLimit}</td>
                                <td>{row?.limitAmount}</td>
                                <td className="flex flex-v-center flex-h-center gap-10">
                                    <img
                                        className="pointer"
                                        src={edit}
                                        alt="edit"
                                        onClick={() => selectBenefit(row)}
                                    />
                                    <img
                                        className="pointer"
                                        src={delet}
                                        alt="delete"
                                        onClick={() => handleDeleteClick(row?.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ConfirmationModal
                    closeModal={() => setIsModalOpen(false)}
                    confirmAction={confirmDelete}
                    message="Are you sure you want to delete this benefit?"
                />
            )}
            {isEdit && (
                <EditBenefit
                    closeModal={() => setIsEdit(false)}
                    fetchData={fetchData}
                    benefit={benefit}
                    id={id}
                    packageId={packageId}

                />
            )}


        </div>
    );
}

export default PackageDetailsTable;
