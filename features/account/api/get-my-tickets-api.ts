import { api } from '@/lib/api';
import type { MyTicketsResponse, TicketOrder } from '../types/tickets.types';

export const getMyTicketsApi = async (
  signal?: AbortSignal
): Promise<TicketOrder[]> => {
  const response = await api.get<MyTicketsResponse>('/tickets', {
    signal,
  });

  return response.data.data;
};
