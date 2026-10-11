type SessionResultsSkeletonProps = {
  showToolbar?: boolean;
};

const SessionResultsSkeleton = ({
  showToolbar = false,
}: SessionResultsSkeletonProps) => (
  <div role="status" className="min-w-0">
    <span className="sr-only">Loading sessions…</span>

    <div aria-hidden="true" className="motion-safe:animate-pulse">
      {showToolbar && (
        <div className="flex items-center justify-between gap-4">
          <div className="h-[18px] w-[145px] rounded-[5px] bg-white/10" />
          <div className="h-[18px] w-[205px] max-w-[45%] rounded-[5px] bg-white/10" />
        </div>
      )}

      <div className="mt-[24px] min-w-0 divide-y divide-[#2A2C3D]">
        {Array.from({ length: 4 }, (_, groupIndex) => (
          <div key={groupIndex} className="min-w-0 py-[32px] first:pt-0">
            <div className="flex items-center gap-[16px]">
              <div className="h-[80px] w-[56px] shrink-0 rounded-[8px] bg-white/10" />
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  <div className="h-[20px] w-[145px] rounded-[5px] bg-white/10" />
                  <div className="h-[21px] w-[38px] rounded-full bg-white/10" />
                </div>
                <div className="h-[16px] w-[62px] rounded-[5px] bg-white/10" />
              </div>
            </div>

            <div className="scrollbar-hidden mt-[14px] flex min-w-0 gap-[12px] overflow-hidden">
              {Array.from({ length: 5 }, (_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="flex h-[104px] w-[252px] shrink-0 flex-col justify-between rounded-[16px] bg-[#1E2031] p-[15px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-[18px] w-[56px] rounded-[5px] bg-white/10" />
                    <div className="h-[22px] w-[72px] rounded-full bg-white/10" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-[12px] w-[116px] rounded-[4px] bg-white/10" />
                    <div className="h-[12px] w-[45px] rounded-[4px] bg-white/10" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-[12px] w-[140px] rounded-[4px] bg-white/10" />
                    <div className="h-[14px] w-[28px] rounded-[4px] bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SessionResultsSkeleton;
