import { api } from '@/lib/api';
import type { BookingOrder, SeatChoice, SeatHold } from '../types/booking.types';
import type { CheckoutValues } from '../schema/checkout-schema';

export const createHoldApi = async (sessionId: string, seats: SeatChoice[]) => {
  const response = await api.post<{ data: SeatHold }>(
    `/sessions/${encodeURIComponent(sessionId)}/holds`,
    { seats: seats.map(({ seatId, ticketType }) => ({ seatId, ticketType })) }
  );
  return response.data.data;
};

export const getHoldApi = async (holdId: string) => {
  const response = await api.get<{ data: SeatHold }>(`/holds/${encodeURIComponent(holdId)}`);
  return response.data.data;
};

export const releaseHoldApi = async (holdId: string) => {
  await api.delete(`/holds/${encodeURIComponent(holdId)}`);
};

export const createOrderApi = async (holdId: string, values: CheckoutValues) => {
  const response = await api.post<{ data: BookingOrder }>('/orders', { holdId, ...values });
  return response.data.data;
};
