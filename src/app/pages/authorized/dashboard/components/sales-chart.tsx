import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  chartDataDayFormatted,
  chartDataNumberFormater,
  formatAmount,
} from "../../../../../helpers";
import { SalesStatistics } from "types/transaction";
import LoadingComponent from "app/pages/shared/loading.component";

const renderContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-primary font-medium border rounded-lg px-5 py-2">
        <div>
          {payload.map((data: any, i: number) => (
            <div key={`${data.value}.${i}`} style={{ color: data.fill }}>{formatAmount(data.value)}</div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const charts = [
  {
    dataRecordKey: "day",
    key: 'daily_sales',
  },
  {
    dataRecordKey: "week",
    key: 'weekly_sales',
  },
  {
    dataRecordKey: "month",
    key: 'monthly_sales',
  },
];

type SalesChartProps = {
  statistics?: SalesStatistics;
  isLoading?: boolean;
}

const SalesChart = ({
  statistics,
  isLoading,
}: SalesChartProps) => {
  const [activeChart, setActiveChart] = useState({
    dataRecordKey: 'day',
    key: 'daily_sales',
    index: 0,
  });
  const [chartData, setChartData] = useState([]);

  const onChangeChart = (index: number, chart: any) => {
    setActiveChart(val => ({
      dataRecordKey: chart.dataRecordKey,
      index,
      key: chart.key
    }));
  };

  useEffect(() => {
    if (statistics && Object.keys(statistics).length > 0) {
      // @ts-ignore
      const data = statistics[activeChart.key];
      setChartData(data);
    }
  }, [activeChart, statistics]);

  if (isLoading) {
    return (
      <LoadingComponent height="h-full" />
    )
  }

  return (
    <div>
      <div className="max-mobile:inline hidden">
        {charts.map((chart, i) => {
          const isActive = i === activeChart.index;
          const bgColor = isActive ? "primary-blue" : "secondary-medium";
          const textColor = isActive ? "white" : "primary";
          return (
            <button
              key={`sales.chart.button.${i}`}
              onClick={() => onChangeChart(i, chart)}
              className={`bg-${bgColor} px-5 py-1 rounded text-${textColor} capitalize mr-2`}
            >
              {chart.dataRecordKey}
            </button>
          );
        })}
      </div>
      <div className="w-full h-[300px] p-5">
        <div className="flex flex-row">
          <p className="flex-1 text-primary-light text-xl font-medium">
            Sales Analytics
          </p>
          <div className="max-mobile:hidden inline">
            {charts.map((chart, i) => {
              const isActive = i === activeChart.index;
              const bgColor = isActive ? "primary-blue" : "secondary-medium";
              const textColor = isActive ? "white" : "primary";
              return (
                <button
                  key={`sales.chart.button.${i}`}
                  onClick={() => onChangeChart(i, chart)}
                  className={`bg-${bgColor} px-5 py-1 rounded text-${textColor} capitalize mr-2`}
                >
                  {chart.dataRecordKey}
                </button>
              );
            })}
          </div>
        </div>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis
              className="font-medium text-xs"
              tickMargin={10}
              tickSize={0}
              tickFormatter={chartDataDayFormatted}
              dataKey={activeChart.dataRecordKey}
            />
            <YAxis
              className="font-medium text-xs"
              tickMargin={10}
              tickSize={0}
              tickFormatter={chartDataNumberFormater}
            />
            <Tooltip content={renderContent} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0052CC" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
