interface SessionsEmptyProps {
  variant: 'coming-soon' | 'next-seven-days' | 'selected-date';
}

const SessionsEmpty = ({ variant }: SessionsEmptyProps) => {
  if (variant === 'coming-soon') {
    return (
      <div className="mt-[20px] rounded-[18px] bg-[#1E2031] px-[20px] py-[35px] text-center">
        <p className="font-semibold text-[16px] text-white">Coming soon</p>
        <p className="mt-[8px] text-[13px] text-[#A9A9A9]">
          Sessions and ticket booking are not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-[#1E2031] px-[20px] py-[35px] text-center text-[14px] text-[#A9A9A9]">
      {variant === 'next-seven-days'
        ? 'No sessions available for the next seven days.'
        : 'No sessions found for this date.'}
    </div>
  );
};

export default SessionsEmpty;
