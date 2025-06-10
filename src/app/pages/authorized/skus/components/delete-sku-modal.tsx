import { SKU } from "types/sku";
import Modal from "../../shared/modal";

type DeleteSKUModalProps = {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
  sku?: SKU;
  state: any;
};

const DeleteSKUModal = ({
  isOpen,
  onClose,
  onDelete,
  sku,
  state,
}: DeleteSKUModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onSubmit={onDelete}
      onClose={onClose}
      title="Delete SKU?"
    >
      {state.isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
        </div>
      ) : (
        <>
          <p className="text-primary text-md">
            SKU Name:
            <p className="font-semibold text-xl">{sku?.sku}</p>
          </p>
        </>
      )}
      <p></p>
    </Modal>
  );
};

export default DeleteSKUModal;
