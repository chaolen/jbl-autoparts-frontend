import React from "react";
import { formatNumber } from "../../../../../helpers";
import { TrendData } from "types/transaction";
import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "store/slices/inventorySlice";
import { productStatus } from "constants/status";
import { useNavigate } from "react-router";
import { RootState } from "store/store";

type TrendCardProps = {
  statistic?: any;
  opposite?: boolean;
};

const TrendCard: React.FC<TrendCardProps> = ({ statistic, opposite }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.user.role);
  const isPositiveTrend = statistic.trend > 0;

  const mainColor = opposite ? (isPositiveTrend ? "red" : "green") : (isPositiveTrend ? "green" : "red");
  const bgColor = opposite ? (isPositiveTrend ? "lightRed" : "lightGreen") : (isPositiveTrend ? "lightGreen" : "lightRed");
  const trendIcon = opposite ? (isPositiveTrend
    ? "/images/trending-down-red.svg"
    : "/images/trending-up-green.svg") : (isPositiveTrend
      ? "/images/trending-up-green.svg"
      : "/images/trending-down-red.svg");
  const value = formatNumber(statistic.value);

  const previewProducts = () => {
    if (statistic?.key === 'low_stock') {
      dispatch(setStatus(productStatus[2]))
      navigate(`/${role}/inventory`);
    } else if (statistic?.key === 'active_products') {
      dispatch(setStatus(productStatus[1]))
      navigate(`/${role}/inventory`);
    }
  }

  return (
    <div className="py-3 px-5 rounded-xl shadow-lg min-w-[270px] h-[140px] bg-white m-3">
      <div className="flex flex-row justify-between">
        <div className="text-primary-light font-regular text-sm">
          {statistic.label}
        </div>
        <button onClick={previewProducts}>
          <img
            src="/images/external-link.svg"
            className="h-[18px] w-[18px]"
            alt="external-link"
          />
        </button>
      </div>
      <div className="font-bold text-primary text-3xl mt-3 mb-2">
        {value}
      </div>
      <div className="flex flex-row items-center">
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
        <div className="text-xs font-light ml-2">from last month</div>
      </div>
    </div>
  );
};

export default TrendCard;
