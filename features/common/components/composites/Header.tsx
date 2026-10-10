import Image from 'next/image';

const Header = () => {
  return (
    <header className="flex justify-center items-center bg-[linear-gradient(180deg,#000000_-212.35%,rgba(0,0,0,0.51)_32.09%,rgba(0,0,0,0)_93.93%)] w-full">
      <div className="flex items-center px-[60px] pt-[30px] pb-[40px] w-full max-w-[1728px]">
        <div className="flex items-center gap-[36px]">
          <div className="flex items-center gap-[4px]">
            <span className="font-bold text-[20px] text-white">KINO</span>
            <span className="font-bold text-[#FF321F] text-[20px]">XII</span>
          </div>

          <p className="font-semibold text-[12px] text-white cursor-pointer">
            SESSIONS
          </p>
        </div>

        <div className="flex items-center gap-[32px] ml-auto">
          <div className="flex items-center gap-[4px] bg-white/10 px-[12px] rounded-full min-w-[380px] h-[41px]">
            <Image
              src="../../../../public/icons/searchVector.svg"
              alt="Search"
              width={16}
              height={16}
            />

            <input
              type="text"
              placeholder="Search films and live events"
              className="bg-transparent outline-none w-full text-[14px] text-white placeholder:text-white"
            />
          </div>
          <div className="flex gap-[12px]">
            <button
              type="button"
              className="bg-[#FF321F] rounded-full w-[96px] h-[41px] font-semibold text-[14px] text-white cursor-pointer"
            >
              Sign up
            </button>

            <button
              type="button"
              className="bg-white rounded-full w-[86px] h-[41px] font-semibold text-[#020B1C] text-[14px] cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
