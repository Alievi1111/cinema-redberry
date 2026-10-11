'use client';

import { motion } from 'motion/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AccountNavItems } from '../../data/AccountNavItems';

const AccountNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'profile';

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <nav className="py-[10px] w-full overflow-x-auto">
      <div className="relative flex items-center gap-[20px] md:gap-[40px] border-[#1E2031] border-b">
        {AccountNavItems.map((item) => {
          const isActive = activeTab === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleTabChange(item.value)}
              className={`relative pb-[14px] cursor-pointer transition-all duration-100 ease-in-out font-semibold text-[14px] ${
                isActive ? 'text-[#FFFFFF]' : 'text-[#A9A9A9]'
              }`}
            >
              {item.label}

              {isActive && (
                <motion.div
                  layoutId="active-nav-underline"
                  className="right-0 bottom-0 left-0 absolute bg-[#E53935] rounded-tl-[2px] rounded-tr-[2px] h-[2px]"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default AccountNavBar;
