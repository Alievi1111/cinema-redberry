import type { TicketOrder } from '@/features/account/types/tickets.types';

export type SeatChoice = { seatId: number; code: string; ticketType: string };

export type SeatHold = {
  holdId: string;
  sessionId: number;
  expiresAt: string;
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
  seats: {
    seatId: number;
    code: string;
    ticketType: { slug: string; name: string };
    price: number;
  }[];
};

export type BookingOrder = TicketOrder & {
  cardLastFour: string;
  contact: { fullName: string; email: string; mobileNumber: string };
};

export type BookingApiError = {
  message: string;
  errors?: Record<string, string[]>;
  contested?: string[];
};
