const SessionsSkeleton = () => {
  return (
    <div
      role="status"
      className="flex flex-col gap-[20px] motion-safe:animate-pulse"
    >
      <span className="sr-only">Loading sessions</span>
      {[0, 1].map((venue) => (
        <div key={venue}>
          <div className="mb-[12px] h-[14px] w-[150px] rounded-full bg-white/10" />

          <div className="flex gap-[10px] overflow-x-auto pb-[5px]">
            <div className="w-[454px] max-w-full shrink-0 rounded-[18px] bg-[#1E2031] p-[15px]">
              <div className="mb-[9px] h-[12px] w-[90px] rounded-full bg-white/10" />

              <div className="flex flex-wrap gap-[10px]">
                {[0, 1].map((ticket) => (
                  <div
                    key={ticket}
                    className="flex h-[81px] w-[207px] max-w-full shrink-0 items-center rounded-[12px] bg-[#020B1C] px-[18px]"
                  >
                    <div className="flex w-[112px] flex-col gap-[10px]">
                      <div className="h-[20px] w-[56px] rounded-full bg-white/10" />
                      <div className="h-[11px] w-[76px] rounded-full bg-white/10" />
                    </div>
                    <div className="h-[61px] border-l border-dashed border-white/20" />
                    <div className="ml-[14px] flex flex-col gap-[10px]">
                      <div className="h-[18px] w-[42px] rounded-full bg-white/10" />
                      <div className="h-[11px] w-[42px] rounded-full bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionsSkeleton;
