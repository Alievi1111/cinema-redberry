'use client';

import { useState } from 'react';
import { useMyTickets } from '../../hook/use-my-tickets';
import type { TicketFilter } from '../../types/tickets.types';
import TicketsTabs from '../primitives/TicketsTabs';
import TicketCard from '../primitives/TicketCard';
import TicketsSkeleton from '../primitives/skelleton/TicketsSkeleton';
import TicketsError from '../primitives/skelleton/TicketsError';

const MyProfileTickets = () => {
  const [activeTab, setActiveTab] = useState<TicketFilter>('upcoming');

  const {
    upcoming,
    past,
    upcomingCount,
    pastCount,
    isLoading,
    isError,
    refetch,
  } = useMyTickets();

  if (isLoading) {
    return <TicketsSkeleton />;
  }

  if (isError) {
    return <TicketsError onRetry={() => void refetch()} />;
  }

  const orders = activeTab === 'upcoming' ? upcoming : past;

  return (
    <section className="min-h-[400px]">
      <TicketsTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        upcomingCount={upcomingCount}
        pastCount={pastCount}
      />

      <div
        id="tickets-panel"
        role="tabpanel"
        aria-labelledby={`tickets-tab-${activeTab}`}
        className="flex flex-col gap-[16px] mt-[20px]"
      >
        {orders.length > 0 ? (
          orders.map((order) => <TicketCard key={order.id} order={order} />)
        ) : (
          <div className="flex flex-col justify-center items-center bg-[#1E2031] px-5 rounded-[20px] min-h-[250px] text-center">
            <p className="font-semibold text-[18px] text-white">
              {activeTab === 'upcoming'
                ? 'No upcoming tickets'
                : 'No past tickets'}
            </p>

            <p className="mt-[8px] text-[#A9A9A9] text-[14px]">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming bookings yet."
                : "You don't have any past bookings yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyProfileTickets;
