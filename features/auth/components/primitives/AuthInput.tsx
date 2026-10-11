import type { ComponentProps } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type AuthInputProps = Omit<
  ComponentProps<'input'>,
  'name' | 'ref' | 'onChange' | 'onBlur'
> & {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
};

const AuthInput = ({
  id,
  label,
  registration,
  error,
  className = '',
  ...props
}: AuthInputProps) => {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className={`block font-medium text-[12px] ${error ? 'text-[#FF3B30]' : 'text-white'}  leading-[16px]`}
      >
        {label}
      </label>

      <input
        {...props}
        {...registration}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`bg-[#1D2033] mt-[10px] px-4 rounded-[12px] outline-none w-full h-[40px] text-[12px] border transition-colors duration-200 placeholder:text-[#A6A6AD] ${
          error
            ? 'border-[#FF3B30] text-[#FF3B30]'
            : 'border-transparent text-white'
        } ${className}`}
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-[#FF3B30] text-[12px]"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
