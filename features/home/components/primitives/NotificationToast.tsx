type NotificationToastProps = {
  movieTitle: string;
  error?: string;
  onClose: () => void;
};

const NotificationToast = ({
  movieTitle,
  error,
  onClose,
}: NotificationToastProps) => (
  <div
    role={error ? 'alert' : 'status'}
    className="fixed right-4 bottom-4 z-[80] flex w-[min(360px,calc(100vw-32px))] items-start gap-[12px] rounded-[14px] border border-[#3B4051] bg-[#1E2031] p-[16px] text-white shadow-[0_16px_40px_rgba(0,0,0,0.4)] sm:right-6 sm:bottom-6"
  >
    <span
      aria-hidden="true"
      className={`flex size-[24px] shrink-0 items-center justify-center rounded-full ${error ? 'bg-[#FF321F]/15 text-[#FF321F]' : 'bg-[#34D985]/15 text-[#34D985]'}`}
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-[16px]">
        <path
          d={error ? 'm4 4 8 8m0-8-8 8' : 'm3 8 3 3 7-7'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[14px] font-semibold">
        {error ? 'Could not add notification' : 'Added to notifications'}
      </p>
      <p className="mt-[3px] text-[12px] text-[#A9A9A9]">
        {error ?? movieTitle}
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Dismiss notification"
      className="cursor-pointer text-[#A9A9A9] hover:text-white focus-visible:outline-2 focus-visible:outline-[#FF321F]"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-[16px]">
        <path
          d="m3 3 10 10M13 3 3 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  </div>
);

export default NotificationToast;
