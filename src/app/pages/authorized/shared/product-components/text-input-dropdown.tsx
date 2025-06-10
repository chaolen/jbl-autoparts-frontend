import { useState, useRef, useEffect } from "react";
import { SKU } from "types/sku";

interface TextInputDropdownProps {
  options: SKU[];
  label?: string;
  placeholder?: string;
  selectedValue?: string;
  onSelect?: (selected?: string) => void;
  handleBlur: (e: any) => void;
  touched: any;
  errors: any;
  isAddProduct?: boolean;
}

const TextInputDropdown = ({
  options,
  label,
  placeholder,
  selectedValue = "",
  onSelect,
  handleBlur,
  touched,
  errors,
  isAddProduct,
}: TextInputDropdownProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>(
    selectedValue
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filteredOptions, setFilteredOptions] = useState<SKU[]>([]);

  useEffect(() => {
    setInputValue(selectedValue);
  }, [selectedValue]);

  const evaluateSuggestions = (value: string) => {
    const filteredOptions = options.filter((option) =>
      option?.sku?.toLowerCase().includes(value?.toLowerCase() ?? "")
    );
    setFilteredOptions(filteredOptions);
  };

  useEffect(() => {
    if (isOpen) {
      evaluateSuggestions(inputValue ?? "");
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    evaluateSuggestions(value);
  };

  const handleSelectOption = (option: SKU) => {
    setInputValue(option.sku);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.sku);
    }
  };

  const _handleBlur = (e: any) => {
    handleBlur(e);
    if (isAddProduct) {
      const match = options.find(
        (option) => option?.sku?.toLowerCase() === inputValue?.toLowerCase()
      );
      if (!match) {
        setInputValue("");
        if (onSelect) {
          onSelect(undefined);
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        const fakeEvent = {
          target: {
            name: "sku",
            value: inputValue,
          },
        };
        handleBlur(fakeEvent);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-1/2 relative" ref={dropdownRef}>
      {label && (
        <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
          {label}
        </label>
      )}
      <div className="flex justify-between items-center text-[14px] w-full text-gray-700 border rounded p-4 leading-tight mb-3">
        <input
          className="focus:outline-none flex-grow"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={_handleBlur}
          onClick={() => setIsOpen(true)}
        />
        <button onClick={() => setIsOpen((prev) => !prev)}>
          <img
            src="/images/chevron-down.svg"
            alt="down"
            className="h-[20px] w-[20px]"
          />
        </button>
      </div>
      {touched.sku && errors.sku && (
        <p className="text-red-500 text-[10px] mt-2">{errors.sku}</p>
      )}
      {isOpen && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 shadow-lg z-10 max-h-[300px] overflow-scroll">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, i) => (
              <li
                key={i}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectOption(option)}
              >
                {option.sku}
              </li>
            ))
          ) : (
            isAddProduct ? <li className="px-4 py-2 text-gray-400">No results found</li> :
              <li onClick={() => handleSelectOption({ sku: inputValue })} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Create {inputValue}?</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TextInputDropdown;
