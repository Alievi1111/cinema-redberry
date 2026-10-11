import { api } from '@/lib/api';
import type { TicketOrder } from '../types/tickets.types';

export const refundOrderApi = async (reference: string): Promise<TicketOrder> => {
  const response = await api.post<{ data: TicketOrder }>(
    `/orders/${encodeURIComponent(reference)}/refund`
  );
  return response.data.data;
};
