interface ComingSoonErrorProps {
  onRetry: () => void;
}

const ComingSoonError = ({ onRetry }: ComingSoonErrorProps) => {
  return (
    <section
      role="alert"
      className="flex justify-center items-center bg-[#020B1C] px-5 min-h-[280px] text-center"
    >
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center bg-[#FF321F]/10 rounded-[16px] w-[56px] h-[56px]">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF321F"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v5" />
            <path d="M12 16h.01" />
          </svg>
        </div>

        <h2 className="mt-[16px] font-bold text-[20px] text-white">
          Unable to load upcoming movies
        </h2>

        <p className="mt-[8px] text-[#A9A9A9] text-[14px]">
          Something went wrong. Please try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="bg-[#FF321F] hover:bg-[#EC3013] mt-[20px] px-[24px] rounded-full h-[40px] font-semibold text-[14px] text-white transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    </section>
  );
};

export default ComingSoonError;
