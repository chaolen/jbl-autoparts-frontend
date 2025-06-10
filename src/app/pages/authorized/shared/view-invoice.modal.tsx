import { Transaction } from "types/transaction";
import Modal from "./modal";
import { formatAmount, formatDate, getImageUrl } from "helpers";
import clsx from "clsx";
import ProductImage from "./product-image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type ViewInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Transaction;
  onCancelTransaction: (txn?: Transaction) => void;
  onReturnTransaction: (txn?: Transaction) => void;
  onProcessTransaction: (txn?: Transaction) => void;
};

const ViewInvoiceModal = ({
  isOpen,
  onClose,
  invoice,
  onCancelTransaction,
  onProcessTransaction,
  onReturnTransaction,
}: ViewInvoiceModalProps) => {
  const user = useSelector((state: RootState) => state.user);
  const role = user.role;
  const isAdmin = role;
  const isCancelled = invoice?.status === 'cancelled';
  const [showOptions, setShowOptions] = useState(false);

  const _onClose = () => {
    setShowOptions(false);
    onClose();
  };

  const discount = invoice?.discount ?? 0;
  const subTotal =
    invoice?.items?.reduce(
      (acc, item: any) => acc + item.product.price * item.count,
      0
    ) ?? 0;

  const discountAmount = subTotal * discount;
  const hasDiscount = discount > 0;
  const status = invoice?.status;
  const isCompleted = status === 'completed';
  const isReserved = status === 'reserved';

  const renderContent = () => (
    <>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          Date: {formatDate(invoice?.createdAt, "MMMM Do YYYY, h:mm:ss a")}
        </span>
        <button
          disabled={!isAdmin || isCancelled}
          onClick={() => setShowOptions(true)}
          title={isAdmin ? "Update Trasaction" : ""}
          className={clsx(
            "px-3 py-1 rounded text-xs font-semibold capitalize",
            {
              "bg-green-100 text-green-600": invoice?.status === "completed",
              "bg-yellow-100 text-yellow-600": invoice?.status === "pending",
              "bg-red-100 text-red-600": invoice?.status === "cancelled",
              "bg-primary-lightYellow text-primary-yellow":
                invoice?.status === "reserved",
            }
          )}
        >
          {invoice?.status}
        </button>
      </div>

      <div className="space-y-3">
        {invoice?.items.map((item: any, i) => (
          <div
            key={i}
            className="flex items-start gap-4 border border-gray-200 p-3 rounded-md"
          >
            <ProductImage
              product={item.product}
              borderRadius="rounded-md"
              height="h-[60px]"
              width="w-[60px]"
            />
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm text-primary">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500">
                Part #: {item.product.partNumber}
              </p>
              <p className="text-xs text-gray-500">
                Price: {formatAmount(item.product.price)} × {item.count}
              </p>
              <p className="text-sm font-semibold text-primary">
                Subtotal: {formatAmount(item.product.price * item.count)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4 space-y-2 text-sm font-medium text-primary">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatAmount(subTotal ?? 0)}</span>
        </div>
        {hasDiscount && (
          <div className="flex justify-between">
            <span>
              Discount: <span className="">({discount * 100}%)</span>
            </span>
            <div>
              <span className="text-red-700 text-sm">
                -{formatAmount(discountAmount)}
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between font-semibold text-primary border-t pt-4">
          <span>Total:</span>
          <span className="text-primary-green text-lg font-bold">
            {formatAmount(invoice?.total ?? 0)}
          </span>
        </div>
      </div>
    </>
  );

  const renderReservedOptions = () => {
    return (
      <div className="flex flex-col w-[200px] gap-2">
        <button
          onClick={() => onProcessTransaction(invoice)}
          className="bg-primary-lightGreen text-primary-green hover:bg-primary-green hover:text-white p-2 hover:font-medium rounded-md"
        >
          Completed
        </button>
        <button
          onClick={() => onCancelTransaction(invoice)}
          className="bg-primary-lightRed text-primary-red hover:bg-primary-red hover:text-white p-2 hover:font-medium rounded-md"
        >
          Cancelled
        </button>
        <button
          onClick={() => setShowOptions(false)}
          className="bg-primary text-white p-2 hover:font-medium rounded-md"
        >
          Cancel
        </button>
      </div>
    );
  };

  const renderCompletedOptions = () => {
    return (
      <div className="flex flex-col w-[200px] gap-2">
        <button
          onClick={() => onReturnTransaction(invoice)}
          className="bg-primary-lightGrapes text-primary-grapes hover:bg-primary-grapes hover:text-white p-2 hover:font-medium rounded-md"
        >
          Returned
        </button>
        <button
          onClick={() => setShowOptions(false)}
          className="bg-primary text-white p-2 hover:font-medium rounded-md"
        >
          Cancel
        </button>
      </div>
    );
  };

  const renderOptions = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="font-medium text-primary">
        Change Status from{" "}
        <span className="capitalize">"{invoice?.status}"</span>
      </p>
      <p className="text-gray-500 font-medium text-sm my-4">To</p>
      {isCompleted ? renderCompletedOptions() : isReserved ? renderReservedOptions() : null}
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      title={`Invoice ${invoice?.invoiceId ?? ""}`}
      onClose={_onClose}
      width="w-2/5 max-900-width:w-full max-900-width:m-2"
      noSubmit
      noCancel
    >
      <div className="h-[300px] overflow-y-auto space-y-4">
        {showOptions && isAdmin ? renderOptions() : renderContent()}
      </div>
    </Modal>
  );
};

export default ViewInvoiceModal;
