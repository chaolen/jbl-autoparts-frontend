import React from "react";

interface QuantityInputProps {
  label: string;
  name: string;
  value: number;
  setValue: (name: string, value: number) => void;
  error?: any;
  touched?: any;
  isRequired?: boolean;
}

const QuantityInput = ({
  label,
  name,
  value,
  setValue,
  touched,
  error,
  isRequired = false,
}: QuantityInputProps) => {
  const handleChange = (newValue: number) => {
    if (newValue < 0) return;
    setValue(name, newValue);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleBlur = (newValue: number) => {
    if (newValue < 0) {
      setValue(name, 0);
    } else {
      setValue(name, newValue);
    }
  };

  return (
    <div className="w-1/2 max-mobile-xs:w-full">
      <label className="tracking-wide text-gray-400 text-xs text-medium bg-white w-auto">
        {label}
      </label>
      <div className="relative flex items-center justify-between w-full border rounded-md">
        <button
          type="button"
          className="items-center justify-center flex h-full w-full"
          onClick={() => handleChange(value - 1)}
        >
          -
        </button>
        <input
          type="number"
          value={value}
          name={name}
          className="border-x border-gray-300 text-center text-gray-900 text-sm focus:outline-none block py-4 w-full"
          onChange={handleInputChange}
          onBlur={(e) => handleBlur(Number(e.target.value))}
        />
        <button
          type="button"
          className="items-center justify-center flex h-full w-full"
          onClick={() => handleChange(value + 1)}
        >
          +
        </button>
      </div>
      {isRequired
        ? touched[name] &&
          error[name] && (
            <p className="text-red-500 text-[10px] mt-2">{error[name]}</p>
          )
        : null}
    </div>
  );
};

export default QuantityInput;
