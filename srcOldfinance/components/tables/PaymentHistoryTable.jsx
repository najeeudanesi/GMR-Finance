import React from 'react';

function PaymentHistoryTable() {
    // Sample data - replace this with actual data fetching logic
    const sampleData = [
        {
            patientId: '001',
            firstName: 'John',
            lastName: 'Doe',
            bill: 1000,
        },
       
    ];

    return (
        <div className="w-100">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Balance</th>
                            <th>Payment Card</th>
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {sampleData.map((patient, index) => (
                            <tr key={index}>
                                <td>{patient.patientId}</td>
                                <td>{patient.firstName}</td>
                                <td>{patient.lastName}</td>
                                <td>NGN {patient.bill}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentHistoryTable;