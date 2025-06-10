import React from "react";

type StatusProps = {
  status: string;
  justify?: string
};

const Status = ({
  status,
  justify = 'justify-end'
}: StatusProps) => {
  const renderContent = () => {
    switch (status) {
      case "available":
        return (
          <div className="flex flex-row items-center bg-primary-lightGreen p-1 rounded-sm">
            <p className="text-primary-green ml-1 text-xs font-semibold">
              Available
            </p>
          </div>
        );
      case "out_of_stock":
        return (
          <div className="flex flex-row items-center bg-primary-lightRed p-1 rounded-sm">
            <p className="text-primary-red ml-1 text-xs font-semibold">
              Out of Stock
            </p>
          </div>
        );
      case "low_in_stock":
        return (
          <div className="flex flex-row items-center bg-primary-lightYellow p-1 rounded-sm">
            <p className="text-primary-yellow ml-1 text-xs font-semibold">
              Low in Stock
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={`flex ${justify}`}>{renderContent()}</div>;
};

export default Status;
