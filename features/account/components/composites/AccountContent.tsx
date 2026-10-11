'use client';

import { useSearchParams } from 'next/navigation';

import AccountNavBar from './AccountNavBar';
import MyProfileTickets from './MyProfileTickets';
import PersonalInformation from './PersonalInformation';

const AccountContent = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'profile';

  return (
    <section className="flex flex-col gap-[41px]">
      <AccountNavBar />

      {activeTab === 'tickets' ? <MyProfileTickets /> : <PersonalInformation />}
    </section>
  );
};

export default AccountContent;
