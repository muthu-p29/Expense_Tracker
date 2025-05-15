import React, { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  error,
  required = false,
  min,
  max,
  step,
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={`block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm
                   ${error ? 'border-red-300' : 'border-gray-300'}
                   px-3 py-2 border`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;