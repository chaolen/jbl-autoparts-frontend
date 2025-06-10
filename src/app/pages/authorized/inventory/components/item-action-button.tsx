import { itemActionOptions } from "constants/default-values";
import { useState, useRef, useEffect } from "react";
import { ItemAction } from "types/inventory";

interface ItemActionButtonProps {
  onSelect: (option: ItemAction) => void;
}

const ItemActionButton = ({ onSelect }: ItemActionButtonProps) => {
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
    <div className="flex items-center justify-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-block"
      >
        <img src="/images/more-horizontal.svg" alt="more-horizontal" />
        {isOpen && (
          <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg -right-full">
            {itemActionOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-200 capitalize"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </button>
    </div>
  );
};

export default ItemActionButton;
