import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex justify-center mt-[43px] px-[34px] w-full">
      <div className="flex flex-col gap-[20px] w-full max-w-[1660px]">
        <div className="bg-[#2A2C3D] w-full h-[1px]" />
        <div className="flex justify-between w-full">
          <Link href="/" className="flex items-center gap-[4px]">
            <span className="font-bold text-[14px] text-white">KINO</span>

            <span className="font-bold text-[#FF321F] text-[14px]">XII</span>
          </Link>
          <p className="text-[#A9A9A9]">
            © 2026 Kino XII. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
