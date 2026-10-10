import Image from 'next/image';

const SignUpPage = () => {
  return (
    <>
      <div className="pr-10">
        <h1 className="font-bold text-[20px] text-white leading-[24px]">
          Sign up
        </h1>

        <p className="mt-[8px] text-[#A6A6AD] text-[12px] leading-[16px]">
          Welcome back to Kino XII
        </p>
      </div>

      <div className="mt-[24px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex justify-center items-center bg-[#1D2033] rounded-[8px] w-[40px] h-[40px]">
            <Image src="/icons/uploadicon.svg" alt="" width={12} height={11} />
          </div>

          <div>
            <p className="font-semibold text-[14px] text-white leading-[18px]">
              Upload avatar (optional)
            </p>

            <p className="mt-[3px] text-[#A6A6AD] text-[12px] leading-[16px]">
              JPG, PNG or WEBP
            </p>
          </div>
        </div>

        <div className="mt-[32px]">
          <label
            htmlFor="username"
            className="block font-medium text-[12px] text-white leading-[16px]"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            placeholder="User"
            className="bg-[#1D2033] mt-[10px] px-4 rounded-[12px] outline-none w-full h-[40px] text-[12px] text-white placeholder:text-[#A6A6AD]"
          />
        </div>

        <div className="mt-[24px]">
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

        <div className="flex gap-[12px] mt-[24px]">
          <div className="flex-1">
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

          <div className="flex-1">
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-[12px] text-white leading-[16px]"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-[#1D2033] mt-[10px] px-4 rounded-[12px] outline-none w-full h-[40px] text-[12px] text-white placeholder:text-[#A6A6AD]"
            />
          </div>
        </div>

        <button
          type="button"
          className="flex justify-center items-center bg-[#5D6070] mt-[30px] rounded-[999px] w-full h-[41px] font-semibold text-[#B9BAC1] text-[14px] cursor-pointer"
        >
          Sign up
        </button>

        <div className="flex justify-center items-center gap-[5px] mt-[24px] text-[14px] leading-[20px]">
          <span className="text-[#A6A6AD]">Already have an account?</span>

          <button
            type="button"
            className="font-semibold text-[#FF3B30] cursor-pointer"
          >
            Log in
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
