'use client';

import { useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
};

export type PopupWrapperProps = {
  children: ReactNode;
  onClose: () => void;
};

const PopupWrapper = ({ children, onClose }: PopupWrapperProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  return (
    <div className="z-[999] fixed inset-0 flex justify-center items-center px-4">
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Popup"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="z-10 relative bg-[#020B1C] p-8 rounded-[28px] w-full max-w-[475px] max-h-[calc(100dvh-32px)] overflow-y-auto"
      >
        <button
          type="button"
          aria-label="Close popup"
          onClick={onClose}
          className="top-8 right-8 absolute flex justify-center items-center w-6 h-6 cursor-pointer"
        >
          <Image src="/icons/close.svg" alt="" width={24} height={24} />
        </button>

        {children}
      </motion.div>
    </div>
  );
};

export default PopupWrapper;
