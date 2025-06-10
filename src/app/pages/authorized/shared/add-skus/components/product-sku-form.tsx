import React, { useCallback, useState } from "react";
import PartInput from "./part-input";
import toast from "react-hot-toast";
import { SKUForm } from "types/sku";
import { defaultSKUForm } from "constants/default-values";

type ProductSKUFormProps = {
  skuForms: SKUForm[];
  suggestions: string[];
  handleSaveSKU: (index: number) => void;
  handleRemoveSKU: (index: number) => void;
  handleAddSKUForm: () => void;
  handleChange: (i1: number, i2: number, value: any) => void;
  addOrRemovePartFromSKU: (
    skuIndex: number,
    partToRemoveIndex?: number
  ) => void;
};

const ProductSKUForm = ({
  skuForms,
  handleSaveSKU,
  handleChange,
  addOrRemovePartFromSKU,
  handleAddSKUForm,
  handleRemoveSKU,
  suggestions,
}: ProductSKUFormProps) => {
  return (
    <div className="flex flex-col w-full items-start">
      <div className="p-6 mb-3">
        {skuForms.map((skuForm, skuIndex) => {
          const isSaved = skuForm.saved;
          const fields = skuForm.fields;
          return (
            <div key={skuIndex} className="mb-4 space-y-2">
              <div className="flex flex-wrap gap-2 items-center">
                {fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="flex items-center gap-1">
                    <PartInput
                      isSaved={isSaved}
                      partIndex={fieldIndex}
                      value={field}
                      placeholder={`Part ${fieldIndex + 1}`}
                      onChange={(value) =>
                        handleChange(skuIndex, fieldIndex, value)
                      }
                      suggestions={suggestions}
                    />
                    {isSaved
                      ? fields.length - 1 !== fieldIndex
                        ? "-"
                        : ""
                      : fields.length > 1 && (
                          <button
                            onClick={() =>
                              addOrRemovePartFromSKU(skuIndex, fieldIndex)
                            }
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            <img
                              src="/images/minus-circle.svg"
                              alt="remove"
                              className="h-[20px] w-[20px]"
                            />
                          </button>
                        )}
                  </div>
                ))}
                {isSaved ? (
                  <button
                    onClick={() => handleRemoveSKU(skuIndex)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => addOrRemovePartFromSKU(skuIndex)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      + Part
                    </button>
                    <button
                      onClick={() => handleSaveSKU(skuIndex)}
                      className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleAddSKUForm}
          className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          + Add SKU
        </button>
      </div>
    </div>
  );
};

export default ProductSKUForm;
