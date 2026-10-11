const TicketCardSkeleton = () => {
  return (
    <div className="flex lg:flex-row flex-col bg-[#1E2031] rounded-[26px] w-full max-w-[1400px] lg:min-h-[183px]">
      <div className="flex flex-1 gap-[20px] p-[20px] lg:px-[30px] min-w-0">
        <div className="bg-white/10 rounded-[8px] w-[100px] h-[134px] shrink-0" />

        <div className="flex flex-col flex-1 gap-[12px] min-w-0">
          <div className="bg-white/10 rounded-[6px] w-[220px] max-w-full h-[24px]" />

          <div className="flex flex-wrap gap-[20px]">
            <div className="bg-white/10 rounded-[6px] w-[120px] h-[35px]" />
            <div className="bg-white/10 rounded-[6px] w-[190px] h-[35px]" />
            <div className="bg-white/10 rounded-[6px] w-[150px] h-[35px]" />
          </div>

          <div className="flex gap-[8px]">
            <div className="bg-white/10 rounded-[6px] w-[90px] h-[25px]" />
            <div className="bg-white/10 rounded-[6px] w-[90px] h-[25px]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[14px] p-[20px] border-[#505261]/40 border-t lg:border-t-0 lg:border-l border-dashed w-full lg:w-[310px]">
        <div className="bg-white/10 rounded-[6px] w-[120px] h-[32px]" />
        <div className="bg-white/10 rounded-[6px] w-[180px] h-[28px]" />
        <div className="bg-white/10 rounded-full w-full h-[35px]" />
      </div>
    </div>
  );
};

const TicketsSkeleton = () => {
  return (
    <div
      role="status"
      aria-label="Loading tickets"
      className="flex flex-col gap-[20px] min-h-[400px] animate-pulse"
    >
      <div className="bg-[#1E2031] rounded-[12px] w-[199px] h-[39px]" />

      <TicketCardSkeleton />
      <TicketCardSkeleton />
    </div>
  );
};

export default TicketsSkeleton;
