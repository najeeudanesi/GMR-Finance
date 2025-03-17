import React, { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { post } from '../../utility/fetch';
import toast from 'react-hot-toast';
import { BsTrash } from 'react-icons/bs';

function ReferPatient({ closeModal, visit, id }) {
    const [testRequests, setTestRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [additionalNote, setAdditionalNote] = useState('');
    const [labCentre, setLabCentre] = useState('');
    const [labTest, setLabTest] = useState('');


    const addLabRequest = () => {
        if (labCentre.trim() !== '' && labTest.trim() !== '') {
            setTestRequests([...testRequests, { labTest, labCentre }]);
            setLabCentre('');
            setLabTest('');
        } else {
            toast("Please add at least one request");
        }
    };

    const removeLabRequest = (index) => {
        const updatedTestRequests = [...testRequests];
        updatedTestRequests.splice(index, 1);
        setTestRequests(updatedTestRequests);
    };

    const referPatient = async () => {
        if (testRequests.length === 0) {
            toast("Please add at least one request");
            return
        }
        if (diagnosis === '' || additionalNote === '') {
            toast("Please fill in all fields");
            return;
        }
        setLoading(true);
        const payload = {
            age: visit?.age.split(" ")[0],
            diagnosis,
            testRequests,
            additionalNote,
        };

        console.log(payload)
        try {
            await post(`/patients/${id}/visit/${visit?.id}/lab-request`, payload);
            toast.success('Lab request added successfully');
            closeModal();
        } catch (error) {
            toast.error('Error adding lab request');
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-box max-w-800">
                <div className="p-40">
                    <h3 className="bold-text">Refer Patient</h3>
                    <div className="m-t-20  ">
                        <div className='flex gap-8'>
                            <InputField label="Lab Request" name="labTest" value={labTest} onChange={(e) => setLabTest(e.target.value)} />
                            <InputField label="Lab Centre" name="labCentre" value={labCentre} onChange={(e) => setLabCentre(e.target.value)} />
                        </div>

                        <div className='flex flex-h-end'><button className="btn m-t-10" onClick={addLabRequest}>+ Add</button></div>

                    </div>
                    {testRequests.length > 0 && (
                        <table className="bordered-table-2 m-t-20">
                            <thead>
                                <tr>
                                    <th className='w-20'>s/n</th>
                                    <th className='w-40'>Lab Request</th>
                                    <th className='w-40'>Lab Centre</th>
                                    <th className='w-20'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testRequests.map((request, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{request.labTest}</td>
                                        <td>{request.labCentre}</td>
                                        <td>
                                            <BsTrash className="text-red pointer" height={20} width={20} onClick={() => removeLabRequest(index)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <TextArea label="Diagnosis" name="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                    <TextArea label="Additional Note" name="additionalNote" value={additionalNote} onChange={(e) => setAdditionalNote(e.target.value)} />
                    <button className="btn m-t-20 w-100" onClick={referPatient} disabled={loading}>Refer Patient</button>
                </div>
            </div>
        </div>
    );
}

export default ReferPatient;
