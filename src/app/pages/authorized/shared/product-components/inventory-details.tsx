import React, { useState } from "react";
import Tag from "./tag";
import { ProductDetails } from "types/inventory";
import TagInput from "./tag-input";
import QuantityInput from "./quantity-input";

interface InventoryDetailsProps {
  fields: ProductDetails;
  setField: (event: any) => void;
  setTags: (tags: string[]) => void;
  errors: any;
  touched: any;
}

const InventoryDetails = ({
  fields,
  setField,
  setTags,
  errors,
  touched
}: InventoryDetailsProps) => {
  const [quantityRemaining, setQuantityRemaining] = useState(fields.quantityRemaining);
  const [quantitySold, setQuantitySold] = useState(fields.quantitySold);
  const [quantityThreshold, setQuantityThreshold] = useState(fields.quantityThreshold ?? 1);

  const handleQuantityChange = (name: string, value: number) => {
    if (name === "quantityRemaining") {
      setQuantityRemaining(value);
    } else if (name === "quantitySold") {
      setQuantitySold(value);
    } else if (name === "quantityThreshold") {
      setQuantityThreshold(value);
    }

    setField({
      target: { name, value: String(value) },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col w-full shadow-lg border bg-white rounded-lg p-4">
      <p className="text-primary font-semibold">Inventory Details</p>
      <div className="flex w-full mt-4 space-x-4 max-mobile:space-x-0 max-mobile:flex-col">
        <div className="flex space-x-4 w-[60%] max-mobile:w-full max-mobile-xs:flex-col max-mobile-xs:space-x-0">
          <QuantityInput
            isRequired
            touched={touched}
            error={errors}
            label="Remaining Quantity"
            name="quantityRemaining"
            value={quantityRemaining}
            setValue={handleQuantityChange}
          />
          <QuantityInput
            label="Sold Quantity"
            name="quantitySold"
            value={quantitySold}
            setValue={handleQuantityChange}
          />
        </div>
        <div className="w-[40%] max-mobile:w-full">
          <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
            Part Number
          </label>
          <input
            name="partNumber"
            value={fields.partNumber}
            onChange={setField}
            className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            placeholder=""
          />
          {touched.partNumber && errors && errors.partNumber && (
            <p className="text-red-500 text-[10px] mt-1">{errors.partNumber}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <QuantityInput
          label="Quantity Threshold"
          name="quantityThreshold"
          value={quantityThreshold}
          setValue={handleQuantityChange}
        />
      </div>
      <TagInput tags={fields.tags} setTags={setTags} errorMessage={errors.tags} />
    </div>
  );
};

export default InventoryDetails;
