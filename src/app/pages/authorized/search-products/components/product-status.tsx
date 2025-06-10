import React from "react";

type ProductStatusProps = {
  status: string;
  justify?: string
};

const ProductStatus = ({
  status,
  justify = 'justify-end'
}: ProductStatusProps) => {
  const renderContent = () => {
    switch (status) {
      case "available":
        return (
          <div className="flex flex-row items-center bg-primary-lightGreen px-2 py-1 rounded-tr-xl rounded-bl-md">
            <img
              src="/images/check-circle-green.svg"
              alt="check"
              className="h-[19px] w-[15px]"
            />
            <p className="text-primary-green ml-1 text-xs font-semibold">
              Available
            </p>
          </div>
        );
      case "out_of_stock":
        return (
          <div className="flex flex-row items-center bg-primary-lightRed px-2 py-1 rounded-tr-xl rounded-bl-md">
            <img
              src="/images/alert-octagon-red.svg"
              alt="check"
              className="h-[19px] w-[15px]"
            />
            <p className="text-primary-red ml-1 text-xs font-semibold">
              Out of Stock
            </p>
          </div>
        );
      case "low_in_stock":
        return (
          <div className="flex flex-row items-center bg-primary-lightYellow px-2 py-1 rounded-tr-xl rounded-bl-md">
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

export default ProductStatus;
