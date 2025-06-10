import React, { useEffect, useState } from "react";
import TextInputDropdown from "./text-input-dropdown";
import { ProductDetails } from "types/inventory";
import { SKU } from "types/sku";

type GeneralInformationProps = {
  handleSelectedSKU: any;
  setField: (event: any) => void;
  handleBlur: (event: any) => void;
  fields: ProductDetails;
  skus?: SKU[];
  errors: any;
  touched: any;
};

const GeneralInformation = ({
  handleSelectedSKU,
  setField,
  fields,
  skus,
  errors,
  handleBlur,
  touched
}: GeneralInformationProps) => {
  const [skusData, setSkusData] = useState<SKU[]>([]);

  useEffect(() => {
    if (skus) {
      setSkusData(skus.map((sku) => ({ _id: sku._id, sku: sku.sku })));
    }
  }, [skus]);

  const renderError = (name: string) => (
    <>
      {touched[name] && errors && errors[name] && (
        <p className="text-red-500 text-[10px] mt-1">{errors[name]}</p>
      )}
    </>
  )

  return (
    <div className="flex flex-col w-full shadow-lg bg-white rounded-lg p-4 border">
      <p className="text-primary font-semibold">General Information</p>
      <div className="flex flex-col flex-wrap w-full">
        <div className="w-full">
          <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
            Product Name
          </label>
          <input
            className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-2 leading-tight focus:outline-none focus:bg-white"
            value={fields.name}
            name="name"
            onChange={setField}
            onBlur={handleBlur}
            placeholder="Type product name"
          />
          {renderError('name')}
        </div>
        <div className="w-full">
          <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
            Brand Name
          </label>
          <input
            className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            value={fields.brand}
            name="brand"
            onChange={setField}
            onBlur={handleBlur}
            placeholder="Type product brand"
          />
          {renderError('brand')}
        </div>
        <div className="w-full">
          <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
            Product Description
          </label>
          <textarea
            placeholder="The cat was playing in the garden."
            className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            onChange={setField}
            onBlur={handleBlur}

            name="description"
            value={fields.description}
            rows={8}
            cols={30}
          />
          {renderError('description')}

        </div>
        <div className="w-full flex space-x-4">
          <TextInputDropdown
            selectedValue={fields.sku}
            options={skusData}
            label="Product SKU"
            placeholder="Type or Search SKU..."
            onSelect={handleSelectedSKU}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            isAddProduct
          />
          <div className="w-1/2">
            <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
              Product Price
            </label>
            <div className="flex flex-row items-center text-primary">
              <input
                type="number"
                name="price"
                value={fields.price}
                onChange={setField}
                onBlur={handleBlur}
                className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="₱ 100.00"
              />
            </div>
            {renderError('price')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
