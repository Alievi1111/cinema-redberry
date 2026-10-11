import type { Metadata } from 'next';

import AccountContent from "@/features/account/components/composites/AccountContent";
import { AuthGuard } from "@/features/auth/guards/AuthGuard";

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your Kino XII profile and tickets.',
  robots: { index: false, follow: false },
};

const Account = () => {
  return (
    <AuthGuard>
      <div className="flex justify-center mt-[111px] px-[51px] w-full">
        <div className="flex flex-col gap-[29px] w-full max-w-[1626px]">
          <p className="font-extrabold text-[24px] text-white">My Profile</p>
          <AccountContent />
        </div>
      </div>
    </AuthGuard>
  );
};

export default Account;
