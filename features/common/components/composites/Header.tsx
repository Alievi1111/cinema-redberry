'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import AuthModal, {
  type AuthVariant,
} from '@/features/auth/components/composites/AuthModal';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';

const Header = () => {
  const [authVariant, setAuthVariant] = useState<AuthVariant | null>(null);

  const { user, isLoading } = useAuthUser();

  const initials = user?.username.slice(0, 2).toUpperCase() ?? '';

  return (
    <>
      <header className="flex justify-center items-center bg-[linear-gradient(180deg,#000000_-212.35%,rgba(0,0,0,0.51)_32.09%,rgba(0,0,0,0)_93.93%)] w-full">
        <div className="flex items-center px-[60px] pt-[30px] pb-[40px] w-full max-w-[1728px]">
          <div className="flex items-center gap-[36px]">
            <Link href="/" className="flex items-center gap-[4px]">
              <span className="font-bold text-[20px] text-white">KINO</span>
              <span className="font-bold text-[#FF321F] text-[20px]">XII</span>
            </Link>

            <p className="font-semibold text-[12px] text-white cursor-pointer">
              SESSIONS
            </p>
          </div>

          <div className="flex items-center gap-[32px] ml-auto">
            <div className="flex items-center gap-[4px] bg-white/10 px-[12px] rounded-full min-w-[380px] h-[41px]">
              <Image
                src="/icons/searchVector.svg"
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

            {isLoading ? (
              <div className="bg-white/10 rounded-full w-[194px] h-[41px] animate-pulse" />
            ) : !user ? (
              <div className="flex gap-[12px]">
                <button
                  type="button"
                  onClick={() => setAuthVariant('signUp')}
                  className="bg-[#FF321F] rounded-full w-[96px] h-[41px] font-semibold text-[14px] text-white cursor-pointer"
                >
                  Sign up
                </button>

                <button
                  type="button"
                  onClick={() => setAuthVariant('logIn')}
                  className="bg-white rounded-full w-[86px] h-[41px] font-semibold text-[#020B1C] text-[14px] cursor-pointer"
                >
                  Log in
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-[12px]">
                <div className="relative flex justify-center items-center bg-[#1E2031] rounded-[8px] w-[42px] h-[42px] overflow-hidden shrink-0">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      sizes="42px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-semibold text-[12px] text-white">
                      {initials}
                    </span>
                  )}
                </div>

                <p className="font-semibold text-[14px] text-white">
                  {user.username.length > 10
                    ? `${user.username.slice(0, 10)}...`
                    : user.username}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {authVariant && (
          <AuthModal
            key="auth-modal"
            variant={authVariant}
            onClose={() => setAuthVariant(null)}
            onChangeVariant={setAuthVariant}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
