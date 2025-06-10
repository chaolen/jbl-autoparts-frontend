import { useEffect, useState } from "react";
import { generateRandomPercentageData } from "../../../../../helpers/makeData";
import { sortPercentageData } from "../../../../../helpers";
import { ProductSummary } from "types/transaction";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setViewProductId } from "store/slices/viewProductSlice";
import { RootState } from "store/store";
import LoadingComponent from "app/pages/shared/loading.component";

const charts = ["day", "week", "month"];

type TopSalesChartProps = {
  topSellingProducts?: ProductSummary[];
  isLoading?: boolean;
}

const TopSalesChart = ({
  topSellingProducts,
  isLoading,
}: TopSalesChartProps) => {
  const [activeChart, setActiveChart] = useState({
    index: 0,
    key: 'day'
  });
  const [chartData, setChartData] = useState<ProductSummary[]>([]);
  const hasRecord = chartData.length > 0;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.user.role);

  const viewProduct = (productId: string) => {
    dispatch(setViewProductId(productId));
    navigate(`/${role}/view-product`);
  };

  useEffect(() => {
    if (topSellingProducts && Object.keys(topSellingProducts).length > 0) {
      //@ts-ignore
      const data = topSellingProducts[activeChart.key] as ProductSummary[];
      const maxTotalSold = Math.max(...data.map(p => p.totalSold));
      const parsedData = data.map(item => ({
        ...item,
        percentage: Number(item.totalSold / maxTotalSold) * 100
      }))
      setChartData(parsedData);
    }
  }, [topSellingProducts, activeChart]);

  const renderEmptyState = () => (
    <p className="text-center font-medium text-sm mt-5 text-secondary-light">
      No records to show
    </p>
  )

  if (isLoading) {
    return (
      <LoadingComponent height="h-full" />
    )
  }

  const renderContent = () => hasRecord ?
    <>
      {chartData?.map((data: any, i) => {
        return (
          <div title="View Product" key={data._id} onClick={() => viewProduct(data.productId)} className="my-5 cursor-pointer">
            <div className="flex flex-row justify-between mb-2">
              <p className="font-light text-primary-light text-xs">
                {data.name}
              </p>
              <p className="font-medium text-xs">{data.totalSold}</p>
            </div>
            <div className="w-full bg-secondary-dark rounded-xl">
              <div
                className={` bg-primary h-[9px] rounded-xl`}
                style={{ width: `${data.percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </> : renderEmptyState();

  return (
    <div className="w-full p-5 h-[300px] overflow-y-auto">
      <p className="flex-1 text-primary-light text-xl font-medium">
        Top Selling Products
      </p>
      <div className="flex flex-row mt-3">
        {charts.map((chart, i) => {
          const isActive = i === activeChart.index;
          const bgColor = isActive ? "primary-blue" : "secondary-medium";
          const textColor = isActive ? "white" : "primary";
          return (
            <button
              key={`top.sales.chart.${i}`}
              onClick={() => setActiveChart({ key: chart, index: i })}
              className={`w-full bg-${bgColor} px-5 py-1 rounded text-${textColor} capitalize mr-2`}
            >
              {chart}
            </button>
          );
        })}
      </div>
      <div className="">
        {renderContent()}
      </div>
    </div>
  );
};

export default TopSalesChart;
