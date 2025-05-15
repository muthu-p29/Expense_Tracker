import React, { ChangeEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
  error?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  className = '',
  error,
  required = false,
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm
                   ${error ? 'border-red-300' : 'border-gray-300'}
                   px-3 py-2 border`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;