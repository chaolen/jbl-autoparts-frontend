import React from 'react';
import { ProductDetails } from 'types/inventory';

type ProductVariantsProps = {
  toggleAddVariantModalOpen: () => void;
  onClickEditVariant: (variant: ProductDetails) => void;
  onClickDeleteVariant: (variant: ProductDetails) => void;
  productVariants: ProductDetails[];
};

const ProductVariants = ({
  toggleAddVariantModalOpen,
  productVariants,
  onClickDeleteVariant,
  onClickEditVariant,
}: ProductVariantsProps) => {
  return (
    <div className="flex flex-col w-full shadow-lg bg-white rounded-lg p-4 border">
      <div className='flex flex-row justify-between items-center'>
        <p className="text-primary font-semibold">Product Variants</p>
        <button onClick={() => toggleAddVariantModalOpen()} className='flex flex-row items-center space-x-1'>
          <p className='text-primary font-semibold text-sm'>Add Variant</p>
          <img className='h-[18px] w-[18px]' src="/images/plus-circle.svg" alt="add-icon" />
        </button>
      </div>
      {productVariants.length > 0 ? (
        <div className="mt-4 space-y-2">
          {productVariants.map((variant, index) => (
            <div key={index} className="flex flex-row p-2 border-b last:border-b-0 justify-between items-center">
              <div className='flex flex-col'>
                <p className="text-gray-700 font-medium">{variant.name}</p>
                <p className="text-gray-500 text-sm">SKU: {variant.sku || '-'}</p>
                <p className="text-gray-500 text-sm">Part Number: {variant.partNumber || '-'}</p>
              </div>
              <div className='items-center flex flex-row justify-center'>
                <button onClick={() => onClickEditVariant(variant)} className='p-1 mr-2'>
                  <img src="/images/edit.svg" alt="edit" className='h-5 w-5' />
                </button>
                <button onClick={() => onClickDeleteVariant(variant)} className='p-1'>
                  <img src="/images/trash-2.svg" alt="edit" className='h-5 w-5' />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2 text-sm">No variants available for this product.</p>
      )}

    </div>
  );
}

export default ProductVariants;