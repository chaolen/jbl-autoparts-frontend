import { useState } from "react";
import Modal from "../../shared/modal";
import { Transaction } from "types/transaction";
import toast from "react-hot-toast";

type UpdateTransactionModalProps = {
  isOpen: boolean;
  onCloseUpdateTransaction: () => void;
  onCancel: () => void;
  onProcess: () => void;
  onReturn: () => void;
  invoice?: Transaction;
};



const UpdateTransactionModal = ({
  isOpen,
  onCancel,
  onProcess,
  onReturn,
  onCloseUpdateTransaction,
  invoice,
}: UpdateTransactionModalProps) => {

  const [selected, setSelected] = useState('');
  let options = []

  const onSelectOption = (e: any) => {
    const { value } = e.target;
    setSelected(value);
  }


  const completedOptions = [
    {
      label: 'Returned Transaction',
      value: 'return',
    },
  ];

  const reservedOptions = [
    {
      label: 'Complete Transaction',
      value: 'process',
    },
    {
      label: 'Cancel Transaction',
      value: 'cancelled',
    },
  ];

  if (invoice?.status === 'reserved') {
    options = reservedOptions;
  } else {
    options = completedOptions;
  }

  const _onClose = () => {
    onCloseUpdateTransaction();
    setSelected('');
  }

  const onSubmit = () => {
    if (selected === '') {
      toast.error('Select an option first');
      return;
    }
    if (selected === 'process') {
      onProcess()
    } else if (selected === 'return') {
      onReturn();
    } else {
      onCancel()
    }
    setSelected('');
  }

  return (
    <Modal
      isOpen={isOpen}
      onSubmit={onSubmit}
      onClose={_onClose}
      title="Update Transaction Status"
      cancelButtonLabel="Close"
    >
      <div className="flex flex-wrap flex-col gap-2 mt-4 ml-2">
        <p className="text-primary text-md font-medium mb-2">
          Invoice ID:
          <span className="font-semibold ml-1">{invoice?.invoiceId}</span>
        </p>
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value={option.value}
              checked={selected === option.value}
              onChange={onSelectOption}
              className={`form-radio ${option.value === 'process' ? 'accent-primary-green' : option.value === 'return' ? 'text-primary-grapes' : 'accent-red-500'}`}
            />
            <span className="text-sm text-gray-700 font-medium capitalize">{option.label}</span>
          </label>
        ))}
      </div>
    </Modal>
  );
};

export default UpdateTransactionModal;
