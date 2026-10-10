interface HeroErrorProps {
  onRetry: () => void;
}

const HeroError = ({ onRetry }: HeroErrorProps) => {
  return (
    <section
      role="alert"
      className="flex justify-center items-center bg-[#020B1C] px-5 w-full min-h-[620px]"
    >
      <div className="flex flex-col items-center max-w-[400px] text-center">
        <div className="flex justify-center items-center bg-[#FF321F]/10 rounded-[16px] w-[64px] h-[64px]">
          <svg
            width="30"
            height="30"
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

        <h2 className="mt-[20px] font-bold text-[24px] text-white">
          Something went wrong
        </h2>

        <p className="mt-[8px] text-[#A9A9A9] text-[14px] leading-[150%]">
          We couldn&apos;t load featured movies. Please check your connection
          and try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="flex justify-center items-center bg-[#FF321F] hover:bg-[#EC3013] mt-[24px] px-[28px] rounded-full h-[42px] font-semibold text-[14px] text-white transition-colors duration-200 cursor-pointer"
        >
          Try again
        </button>
      </div>
    </section>
  );
};

export default HeroError;
