'use client';

import { useSearchParams } from 'next/navigation';
import AccountNavBar from './AccountNavBar';
import MyProfileTickets from './MyProfileTickets';

const AccountContent = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'profile';

  return (
    <section>
      <AccountNavBar />

      {activeTab === 'tickets' ? <MyProfileTickets /> : <div></div>}
    </section>
  );
};

export default AccountContent;
