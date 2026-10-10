import type { ReactNode } from 'react';

export const AuthFormHeader = ({ title }: { title: string }) => (
  <div className="pr-10">
    <h1 className="font-bold text-[20px] text-white leading-[24px]">{title}</h1>

    <p className="mt-[8px] text-[#A6A6AD] text-[12px] leading-[16px]">
      Welcome back to Kino XII
    </p>
  </div>
);

type AuthSubmitButtonProps = {
  children: ReactNode;
  isPending: boolean;
  isFilled: boolean;
};

export const AuthSubmitButton = ({
  children,
  isPending,
  isFilled,
}: AuthSubmitButtonProps) => (
  <button
    type="submit"
    disabled={isPending}
    className={`flex justify-center items-center rounded-full w-full h-[41px] font-semibold text-[14px] cursor-pointer transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
      isFilled ? 'bg-[#EC3013] text-white' : 'bg-[#5D6070] text-[#B9BAC1]'
    }`}
  >
    {children}
  </button>
);

type AuthFormSwitchProps = {
  text: string;
  action: string;
  onClick: () => void;
  className?: string;
};

export const AuthFormSwitch = ({
  text,
  action,
  onClick,
  className = '',
}: AuthFormSwitchProps) => (
  <div
    className={`flex justify-center items-center gap-[5px] text-[14px] leading-[20px] ${className}`}
  >
    <span className="text-[#A6A6AD]">{text}</span>

    <button
      type="button"
      onClick={onClick}
      className="font-semibold text-[#FF3B30] cursor-pointer"
    >
      {action}
    </button>
  </div>
);

type AuthFeedbackProps = {
  message?: string;
  success?: boolean;
};

export const AuthFeedback = ({
  message,
  success = false,
}: AuthFeedbackProps) => {
  if (!message) return null;

  return (
    <p
      role={success ? 'status' : 'alert'}
      className={`mt-4 text-[12px] ${
        success ? 'text-green-400' : 'text-[#FF3B30]'
      }`}
    >
      {message}
    </p>
  );
};
