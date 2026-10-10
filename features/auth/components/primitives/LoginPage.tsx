const LoginPage = () => {
  return (
    <>
      <div className="pr-10">
        <h1 className="font-bold text-[20px] text-white leading-[24px]">
          Log in
        </h1>

        <p className="mt-[6px] text-[#A6A6AD] text-[12px] leading-[16px]">
          Welcome back to Kino XII
        </p>
      </div>

      <div className="mt-[24px]">
        <div>
          <label
            htmlFor="email"
            className="block font-medium text-[12px] text-white leading-[16px]"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            className="bg-[#1D2033] mt-[10px] px-4 rounded-[12px] outline-none w-full h-[40px] text-[12px] text-white placeholder:text-[#A6A6AD]"
          />
        </div>

        <div className="mt-[24px]">
          <label
            htmlFor="password"
            className="block font-medium text-[12px] text-white leading-[16px]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="bg-[#1D2033] mt-[10px] px-4 rounded-[12px] outline-none w-full h-[40px] text-[12px] text-white placeholder:text-[#A6A6AD]"
          />
        </div>

        <button
          type="button"
          className="flex justify-center items-center bg-[#5D6070] mt-[32px] rounded-full w-full h-[41px] font-semibold text-[#B9BAC1] text-[14px] cursor-pointer"
        >
          Log in
        </button>

        <div className="flex justify-center items-center gap-[5px] mt-[16px] text-[14px] leading-[20px]">
          <span className="text-[#A6A6AD]">Don&apos;t have an account?</span>

          <button
            type="button"
            className="font-semibold text-[#FF3B30] cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
