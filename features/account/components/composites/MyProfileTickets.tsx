'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMyTickets } from '../../hook/use-my-tickets';
import { useRefundOrder } from '../../hook/use-refund-order';
import type { TicketFilter, TicketOrder } from '../../types/tickets.types';
import TicketsTabs from '../primitives/TicketsTabs';
import TicketCard from '../primitives/TicketCard';
import RefundConfirmationDialog from '../primitives/RefundConfirmationDialog';
import TicketsSkeleton from '../primitives/skelleton/TicketsSkeleton';
import TicketsError from '../primitives/skelleton/TicketsError';

const MyProfileTickets = () => {
  const [activeTab, setActiveTab] = useState<TicketFilter>('upcoming');
  const [selectedOrder, setSelectedOrder] = useState<TicketOrder | null>(null);
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundNotice, setRefundNotice] = useState<string | null>(null);
  const refund = useRefundOrder();

  const {
    upcoming,
    past,
    upcomingCount,
    pastCount,
    isLoading,
    isError,
    refetch,
  } = useMyTickets();

  const confirmRefund = async () => {
    if (!selectedOrder || refund.isPending) return;
    setRefundError(null);
    try {
      const updatedOrder = await refund.mutateAsync(selectedOrder.reference);
      setSelectedOrder(null);
      setActiveTab('past');
      setRefundNotice(`Order #${updatedOrder.reference} has been refunded.`);
    } catch (error) {
      const apiMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setRefundError(apiMessage ?? 'Could not refund this order. Please try again.');
    }
  };

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

      {refundNotice && <p role="status" className="text-sm text-[#34D985]">{refundNotice}</p>}

      <div
        id="tickets-panel"
        role="tabpanel"
        aria-labelledby={`tickets-tab-${activeTab}`}
        className="flex flex-col gap-[16px] mt-[20px]"
      >
        {orders.length > 0 ? (
          orders.map((order) => (
            <TicketCard
              key={order.id}
              order={order}
              onRefund={(selected) => {
                setRefundNotice(null);
                setRefundError(null);
                setSelectedOrder(selected);
              }}
            />
          ))
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

      {selectedOrder && (
        <RefundConfirmationDialog
          order={selectedOrder}
          pending={refund.isPending}
          error={refundError}
          onConfirm={() => void confirmRefund()}
          onClose={() => {
            setSelectedOrder(null);
            setRefundError(null);
          }}
        />
      )}
    </section>
  );
};

export default MyProfileTickets;
