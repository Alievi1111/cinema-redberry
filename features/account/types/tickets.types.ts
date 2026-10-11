export type TicketFilter = 'upcoming' | 'past';

export interface TicketMovie {
  id: number;
  slug: string;
  title: string;
  runtimeMinutes: number | null;
  posterUrl: string | null;
  ageRating: {
    code: string;
  } | null;
}

export interface TicketSeat {
  id: number;
  seatCode: string;
  ticketType: {
    slug: string;
    name: string;
  };
  price: number;
}

export interface TicketSession {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  hall: {
    id: number;
    name: string;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  format: {
    id: number;
    name: string;
  };
  language: {
    id: number;
    name: string;
  };
  movie: TicketMovie;
}

export interface TicketOrder {
  id: number;
  reference: string;
  status: string;
  totalPrice: number;
  paidAt: string | null;
  refundedAt: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;
  session: TicketSession;
  tickets: TicketSeat[];
}

export interface MyTicketsResponse {
  data: TicketOrder[];
}
