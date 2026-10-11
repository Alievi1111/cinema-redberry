import type { FilterOptions } from '@/features/sessions/types/sessions.types';
import type { Seat } from '@/features/seats/types/seats.types';
import type { BookingOrder, SeatChoice, SeatHold } from '../types/booking.types';

export const holdStorageKey = (userId: number, sessionId: string) =>
  `kinoxii_hold:${userId}:${sessionId}`;

export const restoreChoices = (hold: SeatHold): SeatChoice[] =>
  hold.seats.map((seat) => ({
    seatId: seat.seatId,
    code: seat.code,
    ticketType: seat.ticketType.slug,
  }));

export const availableTicketTypes = (
  options: FilterOptions,
  minAge: number | null | undefined
) => options.ticketTypes.filter((type) =>
  type.blockedFromRatingAge == null || minAge == null || minAge < type.blockedFromRatingAge
);

export const isOldEnough = (age: number | null, minAge: number | null | undefined) =>
  minAge == null || minAge === 0 || (age != null && age >= minAge);

export const reconcileContested = (choices: SeatChoice[], contested: string[]) => {
  const lost = new Set(contested);
  return choices.filter((seat) => !lost.has(seat.code));
};

export const toggleSeatChoice = (
  choices: SeatChoice[],
  seat: { id: number; code: string },
  maxSeats: number
) => {
  if (choices.some((choice) => choice.seatId === seat.id)) {
    return { choices: choices.filter((choice) => choice.seatId !== seat.id), limitReached: false };
  }
  if (choices.length >= maxSeats) return { choices, limitReached: true };
  return {
    choices: [...choices, { seatId: seat.id, code: seat.code, ticketType: 'adult' }],
    limitReached: false,
  };
};

export const seatCategory = (
  seat: Seat,
  selected: boolean,
  contested: boolean
): 'available' | 'selected' | 'sold' | 'held' | 'unavailable' => {
  if (selected) return 'selected';
  if (contested) return 'sold';
  if (seat.isMine) return 'available';
  return seat.state;
};

export const secondsUntil = (expiresAt: string, now = Date.now()) =>
  Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000));

export const isLiveHold = (hold: SeatHold, now = Date.now()) =>
  hold.isLive && hold.seats.length > 0 && secondsUntil(hold.expiresAt, now) > 0;

export const restoreBookingHold = async (
  holdId: string,
  sessionId: number,
  getHold: (id: string) => Promise<SeatHold>,
  now = Date.now()
) => {
  const hold = await getHold(holdId);
  if (hold.sessionId !== sessionId || !isLiveHold(hold, now)) {
    return { status: 'expired' as const, hold: null };
  }
  return { status: 'live' as const, hold };
};

export const releaseUnpaidHold = async (
  holdId: string | null,
  paid: boolean,
  release: (id: string) => Promise<void>
) => {
  if (holdId && !paid) await release(holdId);
};

export const confirmationDetails = (order: BookingOrder) => ({
  reference: order.reference,
  title: order.session.movie.title,
  venue: order.session.venue.name,
  hall: order.session.hall.name,
  date: order.session.date,
  time: order.session.time,
  seatCodes: order.tickets.map((ticket) => ticket.seatCode),
  ticketNames: order.tickets.map((ticket) => ticket.ticketType.name),
  totalPrice: order.totalPrice,
});
