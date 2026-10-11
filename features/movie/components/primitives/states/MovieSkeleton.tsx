import SessionsSkeleton from './SessionsSkeleton';

const MovieSkeleton = () => {
  return (
    <main role="status" className="min-h-screen">
      <span className="sr-only">Loading movie</span>

      <section className="relative flex min-h-[567px] w-full items-center overflow-hidden bg-[#101827]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#020B1C] via-[#101827]/80 to-[#1E2031]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/60 to-transparent" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1728px] flex-col items-start gap-[34px] px-5 pt-[150px] pb-[45px] motion-safe:animate-pulse sm:px-10 lg:flex-row lg:items-end lg:px-[60px]">
          <div className="h-[374px] w-[289px] shrink-0 rounded-[14px] bg-white/10" />

          <div className="flex w-full max-w-[580px] min-w-0 flex-col gap-[15px]">
            <div className="h-[28px] w-[105px] rounded-full bg-white/10" />
            <div className="flex flex-col gap-[10px]">
              <div className="h-[44px] w-4/5 rounded-[8px] bg-white/10" />
              <div className="h-[14px] w-full rounded-full bg-white/10" />
              <div className="h-[14px] w-5/6 rounded-full bg-white/10" />
              <div className="h-[14px] w-2/3 rounded-full bg-white/10" />
            </div>
            <div className="mt-[5px] flex gap-[7px]">
              <div className="h-[28px] w-[48px] rounded-full bg-white/10" />
              <div className="h-[28px] w-[80px] rounded-full bg-white/10" />
              <div className="h-[28px] w-[65px] rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-[40px]">
        <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-[40px] px-5 sm:px-10 lg:flex-row lg:gap-[36px] lg:px-[60px]">
          <div className="min-w-0 flex-1">
            <div className="motion-safe:animate-pulse">
              <div className="h-[20px] w-[100px] rounded-full bg-white/10" />
              <div className="mt-[7px] h-[12px] w-[245px] max-w-full rounded-full bg-white/10" />
              <div className="mt-[20px] flex w-full min-w-0 gap-[10px] overflow-x-auto pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: 7 }, (_, index) => (
                  <div
                    key={index}
                    className="flex h-[80px] w-[80px] shrink-0 flex-col items-center justify-center gap-[7px] rounded-[16px] bg-[#1E2031]"
                  >
                    <div className="h-[12px] w-[28px] rounded-full bg-white/10" />
                    <div className="h-[18px] w-[22px] rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </div>

            <div aria-hidden="true" className="mt-[27px]">
              <SessionsSkeleton />
            </div>
          </div>

          <aside className="w-full shrink-0 motion-safe:animate-pulse lg:w-[389px]">
            <div className="mb-[17px] h-[22px] w-[80px] rounded-full bg-white/10" />
            <div className="flex flex-col gap-[17px]">
              {[150, 220, 120, 160, 95, 60].map((width) => (
                <div key={width}>
                  <div className="h-[12px] w-[85px] rounded-full bg-white/10" />
                  <div
                    className="mt-[7px] h-[21px] max-w-full rounded-full bg-white/10"
                    style={{ width }}
                  />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default MovieSkeleton;
