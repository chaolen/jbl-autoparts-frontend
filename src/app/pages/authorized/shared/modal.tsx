import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: any;
  onSubmit?: any;
  submitButtonLabel?: string;
  width?: string;
  mx?: string;
  className?: string;
  noSubmit?: boolean;
  noCancel?: boolean;
  buttonStyle?: string;
  cancelButtonLabel?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitButtonLabel,
  width,
  mx,
  className,
  noSubmit,
  buttonStyle,
  cancelButtonLabel,
  noCancel,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${className ?? ""}`}>
      <div className={`bg-white rounded-lg shadow-lg ${width ?? "w-2/5"} ${mx ?? ""} p-5 overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-primary text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 ">{children}</div>

        {/* Footer */}
        <div className="mt-4 flex justify-end space-x-3">
          {!noCancel && <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {cancelButtonLabel || "Cancel"}
          </button>}
          {!noSubmit && <button
            type="submit"
            onClick={onSubmit}
            className={`px-4 py-2 rounded-lg ${buttonStyle ?? 'bg-primary text-white hover:bg-primary-dark'}`}
          >
            {submitButtonLabel || "Confirm"}
          </button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
