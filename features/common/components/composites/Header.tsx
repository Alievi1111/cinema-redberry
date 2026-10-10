'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AuthModal, {
  type AuthVariant,
} from '@/features/auth/components/composites/AuthModal';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { clearAuthToken } from '@/features/auth/lib/auth-session';
import ProfileDropdown from '../primitives/ProfileDropdown';

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [authVariant, setAuthVariant] = useState<AuthVariant | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const { user, isLoading } = useAuthUser();

  const initials = user?.username.slice(0, 2).toUpperCase() ?? '';

  const displayUsername =
    user && user.username.length > 10
      ? `${user.username.slice(0, 10)}...`
      : user?.username;

  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    setIsProfileOpen(false);

    clearAuthToken();
    queryClient.clear();

    router.replace('/');
  };

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
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  aria-label="Toggle profile menu"
                  aria-expanded={isProfileOpen}
                  aria-controls="profile-dropdown"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-[12px] cursor-pointer"
                >
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
                    {displayUsername}
                  </p>

                  <motion.span
                    animate={{
                      rotate: isProfileOpen ? 180 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                    }}
                    className="flex justify-center items-center w-[16px] h-[16px]"
                  >
                    <Image
                      src="/icons/ChervetonDown.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <ProfileDropdown
                      key="profile-dropdown"
                      user={user}
                      onClose={() => setIsProfileOpen(false)}
                      onLogout={handleLogout}
                    />
                  )}
                </AnimatePresence>
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
