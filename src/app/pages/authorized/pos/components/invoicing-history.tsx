import { statusStyles } from "constants/status";
import { formatAmount, formatDate } from "helpers";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { Transaction, TransactionStatisticsType } from "types/transaction";
import MyTransactions from "./my-transactions";
import TransactionStatistics from "./transaction-statistics";
import DebouncedInput from "app/pages/shared/debounced-input";

type InvoicingHistoryTabProps = {
  transactions?: Transaction[];
  statistics?: TransactionStatisticsType;
  statisticsLoading: boolean;
  transactionsLoading: boolean;
  transactionFilter: string;
  setTransactionFilter: (val: string) => void;
  updateTransactionStatus: (txn: Transaction) => void;
  viewTransactionDetails: (txn: Transaction) => void;
}

const InvoicingHistoryTab = ({
  transactions,
  statistics,
  statisticsLoading,
  transactionsLoading,
  updateTransactionStatus,
  viewTransactionDetails,
  setTransactionFilter,
  transactionFilter,
}: InvoicingHistoryTabProps) => {

  return (
    <>
      <div className="basis-2/5 flex-col shadow-lg rounded-md col-span-2 px-2 pb-2 overflow-scroll">
        <TransactionStatistics
          loading={statisticsLoading}
          statistics={statistics}
        />
      </div>
      <div className="basis-3/5 flex-col shadow-lg rounded-md col-span-1 p-2 overflow-scroll">
        <div className="sticky top-0 z-10 bg-white py-2 bg-white">
          <DebouncedInput
            value={transactionFilter}
            onChange={(value) => setTransactionFilter(String(value))}
            className="w-full p-2 font-lg shadow border border-block"
            placeholder="Search here..."
            containerWidth="w-full"
            width="w-full"
          />
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          <MyTransactions
            updateTransactionStatus={updateTransactionStatus}
            viewTransactionDetails={viewTransactionDetails}
            loading={transactionsLoading}
            transactions={transactions}
          />
        </div>
      </div>
    </>
  );
};

export default InvoicingHistoryTab;
