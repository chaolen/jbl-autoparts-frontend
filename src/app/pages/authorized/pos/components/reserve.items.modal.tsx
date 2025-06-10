import Modal from "../../shared/modal";

type ReserveItemsModalProps = {
  isOpen: boolean;
  onReserve: () => void;
  onClose: () => void;
};

const ReserveItemsModal = ({
  isOpen,
  onClose,
  onReserve,
}: ReserveItemsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onSubmit={onReserve}
      onClose={onClose}
      submitButtonLabel="Yes"
      title="Reserve Items?"
      buttonStyle="bg-primary-lightYellow text-primary-yellow hover:bg-primary-yellow hover:text-white font-medium"
    >
      <p className="font-medium text-gray-500 text-md">Selected items will be reserved and their stock deducted until the reservation is either paid or cancelled.</p>
    </Modal>
  );
};

export default ReserveItemsModal;
