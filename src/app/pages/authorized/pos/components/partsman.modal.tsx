import { User } from "types/user";
import Modal from "../../shared/modal";

type PartsmanModalProps = {
  isOpen: boolean;
  onSelect: (partsman: User) => void;
  onClose: () => void;
  partsmanUsers: User[];
};

const PartsmanModal = ({
  isOpen,
  onClose,
  onSelect,
  partsmanUsers,
}: PartsmanModalProps) => {

  const renderSelection = () => (
    <>
      {partsmanUsers.map(partsman => {
        return (
          <button onClick={() => onSelect(partsman)} className="flex items-center border-b border-gray-200 hover:bg-gray-50 px-3 py-2 w-full">
            <p className="font-medium text-md">{partsman.name}</p>
          </button>
        )
      })}
    </>
  )

  const renderEmptyState = () => (
    <p className="font-medium text-gray-500 text-md">You will lose all items in the cart.</p>
  )

  return (
    <Modal
      isOpen={isOpen}
      onSubmit={onSelect}
      onClose={onClose}
      submitButtonLabel="Submit"
      title="Select Partsman"
      noSubmit
    >
      <div className="h-[300px] overflow-y-auto">
        {partsmanUsers.length > 0 ? renderSelection() : renderEmptyState()}
      </div>
    </Modal>
  );
};

export default PartsmanModal;
