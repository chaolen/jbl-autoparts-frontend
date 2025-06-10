import LoadingComponent from 'app/pages/shared/loading.component';
import { statusStyles } from 'constants/status';
import { formatAmount, formatDate } from 'helpers';
import React from 'react'
import { Transaction } from 'types/transaction'

type MyTransactionsProps = {
  transactions?: Transaction[];
  loading: boolean;
  updateTransactionStatus: (txn: Transaction) => void;
  viewTransactionDetails: (txn: Transaction) => void;
}

const MyTransactions = ({
  transactions,
  loading,
  updateTransactionStatus,
  viewTransactionDetails,
}: MyTransactionsProps) => {

  const renderLoadingState = () => (
    <LoadingComponent height="h-[200px]" />
  )

  const renderTransactions = () => (
    <>
      {transactions?.map((txn) => {
        const totalItems = txn.items.reduce((sum, item) => sum + (item.count ?? 0), 0);
        const styles = statusStyles[txn.status];
        const isEditable = txn.status === 'reserved' || txn.status === 'completed';
        return (
          <div key={txn._id} className="border rounded-md shadow-sm bg-white flex flex-row justify-between">
            <button
              title='View Invoice'
              onClick={() => viewTransactionDetails(txn)}
              className="flex py-4 pl-4 flex-col justify-between items-start text-sm font-medium text-gray-800">
              <span>Invoice: <span className="font-semibold text-primary">{txn.invoiceId}</span></span>
              <span>Date: {formatDate(new Date(txn.createdAt))}</span>
            </button>
            <div className="py-4 font-medium text-sm flex items-center max-lg-custom:hidden">Items: {totalItems}</div>
            <div
              onClick={() => isEditable ? updateTransactionStatus(txn) : () => { }}
              className={`flex flex-col justify-between items-start text-sm p-4 ${styles.bg} rounded-r-md min-w-[165px] ${isEditable && 'cursor-pointer'}`}>
              <div className="flex flex-row gap-1">
                Status:
                <p className={`flex capitalize ${styles.text} text-sm font-bold`}>
                  {txn.status}
                </p>
              </div>
              <span>Total: <span className="font-bold text-primary">{formatAmount(txn.total)}</span></span>
            </div>
          </div>
        );
      })}</>
  )

  return (
    loading ? renderLoadingState() : renderTransactions()
  )
}

export default MyTransactions;