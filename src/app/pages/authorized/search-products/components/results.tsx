import React from "react";
import { ProductDetails } from "types/inventory";
import ProductImage from "../../shared/product-image";
import ProductStatus from "./product-status";
import { useDispatch, useSelector } from "react-redux";
import { setViewProductId } from "store/slices/viewProductSlice";
import { useNavigate } from "react-router";
import { RootState } from "store/store";

type ResultsProps = {
  results?: ProductDetails[];
};

const Results = ({ results }: ResultsProps) => {
  const user = useSelector((state: RootState) => state.user);
  const role = user.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const viewProduct = (product: ProductDetails) => {
    dispatch(setViewProductId(product?._id));
    navigate(`/${role}/view-product`);
  };

  return (
    <div className="mt-5 grid grid-cols-4 gap-4 gap-y-5 max-mobile:grid-cols-2">
      {results?.map((result) => {
        return (
          <div
            onClick={() => viewProduct(result)}
            className="shadow-xl rounded-xl cursor-pointer"
          >
            <ProductImage height="aspect-square" product={result}>
              <ProductStatus status={result.status} />
            </ProductImage>
            <div className="p-2 pb-4">
              <p className="line-clamp-3 font-semibold color-primary">
                {result.name}
              </p>
              <p className="text-primary-green font-bold">₱ {result.price}</p>
              <p className="font-medium text-primary">
                Part #: {result.partNumber ?? "-"}
              </p>
              <p className="font-medium text-primary">
                Stock: {result.quantityRemaining ?? "-"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Results;
