import React from 'react';
import { RiCloseFill } from 'react-icons/ri';

function ConfirmationModal({ closeModal, confirmAction, message }) {
    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-600">
                <div className="p-40">
                    <h3 className="bold-text">Confirmation</h3>
                    <p className="m-t-20">{message}</p>
                    <div className="w-100 m-t-20 flex flex-h-end gap-10">
                        <button className="btn w-20" onClick={confirmAction}>Yes</button>
                        <button className="comment-btn w-20" onClick={closeModal}>No</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
