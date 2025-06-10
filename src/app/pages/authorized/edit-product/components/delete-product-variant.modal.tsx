import React from "react";
import { ProductDetails } from "types/inventory";
import Modal from "../../shared/modal";


type DeleteProductVariantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: any, helpers: any) => void;
  loading?: boolean;
  productToDelete?: ProductDetails;
};

const DeleteProductVariantModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  productToDelete,
}: DeleteProductVariantModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onSubmit={onSubmit}
      onClose={onClose}
      title="Delete Product Variant?"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
        </div>
      ) : (
        <>
          <p className="text-primary text-md">
            Product Name:
            <p className="font-semibold text-xl">{productToDelete?.name}</p>
          </p>
          <p className="text-primary text-md">
            Part Number:
            <p className="font-semibold text-xl">
              {productToDelete?.partNumber}
            </p>
          </p>
        </>
      )}
      <p></p>
    </Modal>
  )
}

export default DeleteProductVariantModal;
