import LoadingComponent from 'app/pages/shared/loading.component';
import { formatAmount } from 'helpers';
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionPeriodKey, TransactionPeriodStats, TransactionStatisticsType } from 'types/transaction';


const order: TransactionPeriodKey[] = [
  "today",
  "yesterday",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisYear",
  "lastYear",
];
type TransactionStatisticsProps = {
  statistics?: TransactionStatisticsType;
  loading: boolean;
}

const TransactionStatistics = ({
  statistics,
  loading,
}: TransactionStatisticsProps) => {

  const [selectedTimeRange, setSelectedTimeRange] = useState('');
  const [comparisonChart, setComparisonChart] = useState<TransactionPeriodStats[]>([]);

  useEffect(() => {
    if (statistics && Object.keys(statistics).length > 0) {
      setComparisonChart(order.map(order => ({
        ...statistics[order],
      })))
    }
  }, []);

  const renderLoadingState = () => (
    <LoadingComponent height="h-[200px]" />
  )

  const renderStatsToday = () => (
    <div className='border shadow-md rounded-md p-2'>
      <p className='text-md font-bold text-primary p-2 underline'>Today</p>
      <div className='flex flex-col items-center p-2 space-y-4'>
        <div className='text-center'>
          <p className='font-bold text-2xl'>
            Total Sale
          </p>
          <p className='font-bold text-5xl'>
            {formatAmount(statistics?.today?.total ?? 0)}
          </p>
        </div>
        <div className='grid max-mobile:grid-cols-2'>
          <div className=''>
            <div className='text-center max-mobile:mb-0 mb-4'>
              <p className='font-bold text-3xl'>
                {statistics?.today?.itemsSold}
              </p>
              <p className='font-semibold text-md text-center'>
                Items Sold
              </p>
            </div>
            <div className='text-center max-mobile:mb-0 mb-4'>
              <p className='font-bold text-3xl'>
                {statistics?.today?.transactionCount}
              </p>
              <p className='font-semibold text-md'>
                # of Transactions
              </p>
            </div>
          </div>
          <div>
            <div className='text-center max-mobile:mb-0 mb-4'>
              <p className='font-bold text-3xl'>
                {statistics?.today?.avgItemsPerTransaction.toFixed(1)}
              </p>
              <p className='font-semibold text-md text-center'>
                Avg. Items per Transaction
              </p>
            </div>
            <div className='text-center max-mobile:mb-0 mb-4'>
              <p className='font-bold text-3xl'>
                {formatAmount(statistics?.today?.avgTransactionValue ?? 0)}
              </p>
              <p className='font-semibold text-md'>
                Avg. Transaction Value
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (statistics && Object.keys(statistics).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 text-primary max-lg-custom:order-first uppercase rounded">
      {loading ? renderLoadingState() : renderStatsToday()}
    </div>
  )
}

export default TransactionStatistics;