interface SessionsErrorProps {
  onRetry: () => void;
}

const SessionsError = ({ onRetry }: SessionsErrorProps) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-[12px] rounded-[18px] bg-[#1E2031] px-[20px] py-[30px] text-center"
    >
      <p className="text-[14px] text-[#A9A9A9]">Failed to load sessions.</p>

      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-full bg-[#FF321F] px-[20px] py-[10px] font-semibold text-[12px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Try again
      </button>
    </div>
  );
};

export default SessionsError;
