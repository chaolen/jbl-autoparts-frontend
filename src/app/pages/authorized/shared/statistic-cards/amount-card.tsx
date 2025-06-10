import React from "react";
import { formatAmount } from "../../../../../helpers";

type TrendCardProps = {
  statistic?: any;
};

const AmountCard: React.FC<TrendCardProps> = ({ statistic }) => {
  const isPositiveTrend = statistic.trend > 0;

  const mainColor = isPositiveTrend ? "green" : "red";
  const bgColor = isPositiveTrend ? "lightGreen" : "lightRed";
  const trendIcon = isPositiveTrend
    ? "/images/trending-up-green.svg"
    : "/images/trending-down-red.svg";
  const value = formatAmount(statistic.value);
  return (
    <div className="py-3 px-5 rounded-xl shadow-lg bg-white m-3 flex-nowrap whitespace-nowrap h-[140px]">
      <div className="text-primary-light font-regular text-sm">
        {statistic.label}
      </div>
      <div className="font-bold text-primary text-3xl mt-3 mb-2">{value}</div>
      <div className="flex flex-row items-center flex-nowrap">
        <div
          className={`text-sm text-primary-${mainColor} font-semibold bg-primary-${bgColor} rounded-lg flex flex-row items-center px-2 py-1`}
        >
          {statistic.trend}%
          <img
            className="w-[20px] h-[15px] ml-1"
            src={trendIcon}
            alt="trendIcon"
          />
        </div>
        <div className="text-xs font-light ml-2 whitespace-nowrap">
          from last month
        </div>
      </div>
    </div>
  );
};

export default AmountCard;
