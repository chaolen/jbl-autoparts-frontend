import React, { useState, useRef, useEffect, useCallback } from "react";

interface PartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  partIndex: number;
  isSaved: boolean;
}

const PartInput = ({
  value,
  onChange,
  placeholder,
  suggestions,
  isSaved = false,
}: PartInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().startsWith(value.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        onChange(filtered[activeIndex]);
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={isSaved}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        className="border p-2 rounded-md w-32 appearance-none"
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute left-0 z-20 mt-1 w-32 bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
          {filtered.map((suggestion, index) => (
            <li
              key={index}
              className={`px-3 py-1 cursor-pointer text-sm text-left ${
                index === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
                setActiveIndex(-1);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PartInput;
