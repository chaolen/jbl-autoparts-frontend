import Modal from "../../shared/modal";

type DeleteCartModalProps = {
  isOpen: boolean;
  onDelete: (hideModal?: boolean) => void;
  onClose: () => void;
};

const DeleteCartModal = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteCartModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onSubmit={() => onDelete(false)}
      onClose={onClose}
      submitButtonLabel="Yes"
      title="Confirm delete Cart?"
      buttonStyle="bg-primary-lightRed text-primary-red hover:bg-primary-red hover:text-white border font-medium"
    >
      <p className="font-medium text-gray-500 text-md">You will lose all items in the cart.</p>
    </Modal>
  );
};

export default DeleteCartModal;
