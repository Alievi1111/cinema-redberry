import AccountContent from '@/features/account/components/composites/AccountContent';
import AccountNavBar from '@/features/account/components/composites/AccountNavBar';
import { AuthGuard } from '@/features/auth/guards/AuthGuard';

const Account = () => {
  return (
    <AuthGuard>
      <div className="flex justify-center mt-[111px] px-[51px] w-full">
        <div className="flex flex-col gap-[29px] w-full max-w-[1626px]">
          <p className="font-extrabold text-[24px]">My Profile</p>
          <AccountContent />
        </div>
      </div>
    </AuthGuard>
  );
};

export default Account;
