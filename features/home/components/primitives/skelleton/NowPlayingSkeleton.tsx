const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-[#1D2033] p-3 rounded-[20px] w-[260px] h-[452px] shrink-0">
      <div className="bg-white/10 rounded-[16px] w-full h-[300px]" />

      <div className="bg-white/10 mt-[12px] rounded-[6px] w-[80%] h-[20px]" />

      <div className="bg-white/10 mt-[8px] rounded-[6px] w-[65%] h-[14px]" />

      <div className="bg-white/10 mt-[10px] rounded-[6px] w-[35px] h-[14px]" />

      <div className="flex justify-between items-center mt-auto">
        <div className="bg-white/10 rounded-[6px] w-[75px] h-[14px]" />
        <div className="bg-white/10 rounded-full w-[119px] h-[35px]" />
      </div>
    </div>
  );
};

const NowPlayingSkeleton = () => {
  return (
    <section
      role="status"
      aria-label="Loading now playing movies"
      className="bg-[#020B1C] py-[32px]"
    >
      <div className="mx-auto px-5 sm:px-10 lg:px-[64px] w-full max-w-[1728px]">
        <div className="bg-white/10 mb-[24px] rounded-[8px] w-[185px] h-[30px] animate-pulse" />

        <div className="flex gap-[16px] overflow-hidden animate-pulse">
          {Array.from({ length: 6 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NowPlayingSkeleton;
