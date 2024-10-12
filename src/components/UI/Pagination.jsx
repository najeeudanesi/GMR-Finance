import React from "react";

const Pagination = ({ currentPage, pageSize, totalPages, onPageChange }) => {

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination gap-8 flex flex-v-center">
            <button onClick={handlePrevious} disabled={currentPage === 1} className="btn">
                Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages} className="btn">
                Next
            </button>
        </div>
    );
};

export default Pagination;
