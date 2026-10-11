import Image from 'next/image';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface ReusableUpdateProfileInputProps {
  id: string;
  label: string;
  registration?: UseFormRegisterReturn;
  error?: string;
  helperText?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'select';
  value?: string;
  readOnly?: boolean;
  options?: SelectOption[];
  autoComplete?: string;
}

const ReusableUpdateProfileInput = ({
  id,
  label,
  registration,
  error,
  helperText,
  placeholder,
  type = 'text',
  value,
  readOnly = false,
  options = [],
  autoComplete,
}: ReusableUpdateProfileInputProps) => {
  const isSelect = type === 'select';

  const inputClassName = `
    w-full h-[40px] rounded-[12px] bg-[#1E2031]
    px-[16px] outline-none border
    text-[12px] font-semibold
    transition-colors duration-200
    placeholder:text-[#A6A6AD]
    ${
      error
        ? 'border-[#FF3B30] text-[#FF3B30]'
        : 'border-transparent text-white'
    }
    ${readOnly ? 'cursor-default text-[#A9A9A9]' : ''}
    ${isSelect ? 'appearance-none pr-[45px] cursor-pointer' : ''}
    ${type === 'date' ? '[color-scheme:dark]' : ''}
  `;

  const describedBy =
    [error ? `${id}-error` : null, helperText ? `${id}-helper` : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className="flex flex-col gap-[10px] w-full">
      <label
        htmlFor={id}
        className={`text-[12px] font-semibold leading-[16px] ${
          error ? 'text-[#FF3B30]' : 'text-white'
        }`}
      >
        {label}
      </label>

      <div className="relative">
        {isSelect ? (
          <>
            <select
              {...registration}
              id={id}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              className={inputClassName}
              defaultValue=""
            >
              <option value="">{placeholder || 'Select venue'}</option>

              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Image
              src="/icons/ChervetonDown.svg"
              alt=""
              width={16}
              height={16}
              className="top-1/2 right-[16px] absolute -translate-y-1/2 pointer-events-none"
            />
          </>
        ) : (
          <input
            {...registration}
            id={id}
            type={type}
            value={value}
            readOnly={readOnly}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={inputClassName}
          />
        )}
      </div>

      {helperText && (
        <p
          id={`${id}-helper`}
          className="font-medium text-[#A9A9A9] text-[12px] leading-[130%]"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[#FF3B30] text-[12px] leading-[130%] whitespace-pre-line"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default ReusableUpdateProfileInput;
