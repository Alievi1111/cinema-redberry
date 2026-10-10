'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

import type { AuthUser } from '@/features/auth/types/type';

interface ProfileDropdownProps {
  user: AuthUser;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileDropdown = ({ user, onClose, onLogout }: ProfileDropdownProps) => {
  const displayName = user.fullName?.trim() || user.username;
  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <motion.div
      id="profile-dropdown"
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="top-[calc(100%+12px)] right-0 z-50 absolute bg-[#020B1C] rounded-[16px] w-[302px] overflow-hidden origin-top-right"
    >
      <div className="flex items-center gap-[12px] px-[20px] pt-[20px]">
        <div className="relative flex justify-center items-center bg-[#1E2031] rounded-[8px] w-[42px] h-[42px] shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={displayName}
              fill
              sizes="42px"
              className="rounded-[8px] object-cover"
            />
          ) : (
            <span className="font-semibold text-[12px] text-white">
              {initials}
            </span>
          )}

          {!user.profileComplete && (
            <Image
              src="/icons/Dot.svg"
              alt=""
              width={8}
              height={8}
              className="right-0 bottom-0 z-10 absolute"
            />
          )}
        </div>

        <div className="flex flex-col gap-[2px] min-w-0">
          <h3
            title={displayName}
            className="font-semibold text-[14px] text-white truncate"
          >
            {displayName}
          </h3>

          <p
            title={user.email}
            className="text-[#A9A9A9] text-[12px] truncate leading-[130%]"
          >
            {user.email}
          </p>
        </div>
      </div>

      {!user.profileComplete ? (
        <div className="bg-[#E27E04]/10 mx-[20px] mt-[16px] px-[12px] py-[10px] rounded-[10px]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-semibold text-[#E27E04] text-[14px]">
              Profile incomplete
            </p>

            <p className="text-[#A9A9A9] text-[12px] leading-[130%]">
              Please complete your profile to enable booking
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#4ADE801A] mx-[20px] mt-[16px] px-[12px] py-[10px] rounded-[10px]">
          <div className="flex gap-[6px]">
            <p className="font-semibold text-[#4ADE80] text-[14px]">
              Profile Complete
            </p>
            <Image
              src="/icons/ProfileComplete.svg"
              alt=""
              width={16}
              height={16}
            />
          </div>
        </div>
      )}

      <nav aria-label="Account" className="mt-[16px] w-full">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-[8px] hover:bg-white/5 px-[20px] h-[40px] transition-colors duration-200"
        >
          <Image src="/icons/Profile.svg" alt="" width={16} height={16} />

          <span className="font-semibold text-[14px] text-white">
            My Profile
          </span>
        </Link>

        <Link
          href="/tickets"
          onClick={onClose}
          className="flex items-center gap-[8px] hover:bg-white/5 px-[20px] h-[40px] transition-colors duration-200"
        >
          <Image src="/icons/ticket.svg" alt="" width={16} height={16} />

          <span className="font-semibold text-[14px] text-white">
            My Tickets
          </span>
        </Link>
      </nav>

      <div className="mt-[4px] pb-[4px] border-[#1E2031] border-t">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-[8px] hover:bg-[#FF321F]/10 px-[20px] w-full h-[40px] text-left transition-colors duration-200 cursor-pointer"
        >
          <Image src="/icons/logOut.svg" alt="" width={16} height={16} />

          <span className="font-semibold text-[#FF321F] text-[14px]">
            Log out
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileDropdown;
