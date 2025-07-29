import React, { useCallback, useEffect, useState } from "react";
import TrendCard from "./trend-card";
import AmountCard from "./amount-card";
import { SalesStatistics } from "types/transaction";
import moment from "moment";
import LoadingComponent from "app/pages/shared/loading.component";

type StatisticCarsProps = {
  statistics?: SalesStatistics;
  isDashboard?: boolean;
  isLoading?: boolean;
};

const statsData = [
  {
    key: "total_inventory_value",
    label: "Total Inventory Value",
    isAmount: true,
  },
  {
    key: "total_sales",
    label: "Total Sales",
    isAmount: true,
  },
  {
    key: "total_income",
    label: "Total Income",
    isAmount: true,
  },
  {
    key: "active_products",
    label: "Active Products",
  },
  {
    key: "low_stock",
    label: "Low in Stock Products",
    opposite: true
  },
];

const StatisticCards = ({ statistics, isDashboard, isLoading }: StatisticCarsProps) => {
  const [cardsData, setCardsData] = useState<any[]>();

  const loadData = useCallback(() => {
    if (statistics && Object.keys(statistics).length > 0) {
      const data = statsData.map(data => ({
        label: data.label,
        //@ts-ignore
        value: statistics[data.key],
        //@ts-ignore
        trend: Number(statistics.trends[data.key]).toFixed(0),
        isAmount: data.isAmount,
        opposite: data.opposite,
        key: data.key
      }))
      setCardsData(data);
    }
  }, [statistics]);

  useEffect(() => {
    loadData();
  }, [statistics])

  if (isLoading) {
    return (
      <LoadingComponent height="h-[50px]" />
    )
  }

  return (
    <div>
      {isDashboard && <p className="mt-5 text-bold font-semibold text-primary text-xl">Month of {moment().format('MMMM')}</p>}
      <div className="flex w-full h-full space-x-4 overflow-x-auto no-scrollbar">
        {cardsData?.map((stat, i) =>
          stat.isAmount ? (
            <AmountCard key={`stats.amount.card.${i}`} statistic={stat} />
          ) : (
            <TrendCard key={`stats.card.${i}`} statistic={stat} opposite={stat.opposite} />
          )
        )}
      </div>
    </div>
  );
};

export default StatisticCards;
