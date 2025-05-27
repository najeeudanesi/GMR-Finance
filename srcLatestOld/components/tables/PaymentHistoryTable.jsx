import React from "react";
import { formatDate } from "../../utility/general";

function PaymentHistoryTable({ data }) {
  return (
    <div className="w-100 none-flex-item m-t-40">
      <h2 className="text-xl font-semibold">Transaction History</h2>
      <table className="bordered-table">
        <thead className="border-top-none">
          <tr className="border-top-none">
            <th className="w-10">Date</th>
            <th>Amount Deposited</th>
            <th>Amount Transacted</th>
            <th>Current Balance</th>
            <th>Transaction Done For</th>
            <th>Transaction Number</th>
            <th>Transaction Purpose</th>
            <th>Service/Product Name</th>
          </tr>
        </thead>
        <tbody className="white-bg view-det-pane">
          {data?.depositWalletHistories?.map((history) => (
            <tr key={history?.id}>
              <td>{history?.isDeposit ? formatDate(data?.lastDepositDate) : formatDate(history?.transactionDate)}</td>
              <td>{history?.isDeposit ? history?.amountTransacted : '-'}</td>
              <td>{!history?.isDeposit ? history?.amountTransacted : '-'}</td>
              <td>{history?.currentBalance}</td>
              <td>{`${history?.transactionDoneForPatient?.firstName} ${history?.transactionDoneForPatient?.lastName}`}</td>
              <td>{history?.transactionNumber}</td>
              <td>{history?.transactionPurpose}</td>
              <td>
                {history?.isDeposit ? 'Deposit' : history?.depositWalletTransaction?.serviceOrProductName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistoryTable;