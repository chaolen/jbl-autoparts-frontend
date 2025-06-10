import React, { useEffect, useState } from "react";

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  containerWidth,
  ...props
}: {
  value: string | number;
  containerWidth?: string;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className={`flex`}>
      <div className={`flex flex-row border-secondary-light border rounded-md items-center px-2 ${containerWidth ?? ""}`}>
        <img
          src="/images/search.svg"
          alt="search"
          className="h-[15px] w-[15px] mr-2"
        />
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`form-input rounded px-2 py-1.5 focus:outline-none focus:ring-0 ${containerWidth}`}
        />
      </div>
    </div>
  );
};

export default DebouncedInput;
