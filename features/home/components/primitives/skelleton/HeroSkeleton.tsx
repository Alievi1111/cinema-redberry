const HeroSkeleton = () => {
  return (
    <section
      aria-label="Loading featured movies"
      role="status"
      className="relative flex items-center bg-[#020B1C] w-full min-h-[760px]"
    >
      <div className="mx-auto px-5 sm:px-10 lg:px-[67px] w-full max-w-[1728px]">
        <div className="flex flex-col gap-[15px] w-full max-w-[580px] animate-pulse">
          <div className="bg-white/10 rounded-full w-[190px] h-[28px]" />

          <div className="bg-white/10 rounded-[8px] w-[350px] max-w-full h-[45px]" />

          <div className="flex flex-wrap gap-[8px]">
            {[50, 110, 80, 110].map((width, index) => (
              <div
                key={index}
                style={{ width }}
                className="bg-white/10 rounded-full h-[28px]"
              />
            ))}
          </div>

          <div className="flex flex-col gap-[8px]">
            <div className="bg-white/10 rounded-full w-full h-[14px]" />
            <div className="bg-white/10 rounded-full w-[90%] h-[14px]" />
            <div className="bg-white/10 rounded-full w-[75%] h-[14px]" />
          </div>

          <div className="flex gap-[10px] mt-[4px]">
            <div className="bg-white/10 rounded-full w-[143px] h-[42px]" />
            <div className="bg-white/10 rounded-full w-[145px] h-[42px]" />
          </div>
        </div>
      </div>

      <div className="right-0 bottom-[30px] left-0 absolute">
        <div className="flex items-center gap-[20px] mx-auto px-5 sm:px-10 lg:px-[67px] w-full max-w-[1728px]">
          <div className="flex-1 bg-white/10 rounded-full h-[3px]" />

          <div className="flex gap-[10px]">
            <div className="bg-white/10 rounded-full w-[40px] h-[40px]" />
            <div className="bg-white/10 rounded-full w-[40px] h-[40px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
