const ComingSoonSkeleton = () => {
  return (
    <section
      role="status"
      aria-label="Loading upcoming movies"
      className="bg-[#020B1C] px-5 sm:px-10 lg:px-16 pt-10"
    >
      <div className="mx-auto w-full max-w-[1728px] animate-pulse">
        <div className="bg-white/10 mb-[24px] rounded-[8px] w-[190px] h-[30px]" />

        <div className="flex gap-[16px] overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-[15px] bg-[#1E2031] p-[12px] rounded-[20px] w-[470px] h-[160px] shrink-0"
            >
              <div className="bg-white/10 rounded-[12px] w-[229px] h-[136px] shrink-0" />

              <div className="flex flex-col flex-1 gap-[10px]">
                <div className="bg-white/10 rounded-full w-[90%] h-[12px]" />
                <div className="bg-white/10 rounded-full w-[80%] h-[15px]" />
                <div className="bg-white/10 rounded-full w-full h-[12px]" />
                <div className="bg-white/10 rounded-full w-[35px] h-[12px]" />

                <div className="bg-white/10 mt-[8px] rounded-full w-[97px] h-[28px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSkeleton;
