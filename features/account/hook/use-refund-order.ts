'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refundOrderApi } from '../api/refund-order-api';
import type { TicketOrder } from '../types/tickets.types';
import { replaceRefundedOrder } from '../utils/refund-order';
import { MY_TICKETS_QUERY_KEY } from './use-my-tickets';

export const useRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundOrderApi,
    onSuccess: (updatedOrder) => {
      queryClient.setQueriesData<TicketOrder[]>(
        { queryKey: MY_TICKETS_QUERY_KEY },
        (orders) => replaceRefundedOrder(orders, updatedOrder)
      );

      for (const key of ['my-tickets', 'seat-map', 'seat-session', 'sessions', 'movie-sessions']) {
        void queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: MY_TICKETS_QUERY_KEY });
    },
  });
};
