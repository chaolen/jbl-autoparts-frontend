import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  selected: any;
  options: any[];
  onSelect: (option: string) => void;
}

export default function Dropdown({
  selected,
  options,
  onSelect,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-secondary-medium text-primary-light rounded-lg flex flex-row font-medium items-center justify-center"
      >
        Status:
        <div className="text-black ml-1 mr-2">{selected.label}</div>
        <img
          src="/images/chevron-down.svg"
          alt="chevron-down"
          className="text-primary h-4 w-5.73"
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-200"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
