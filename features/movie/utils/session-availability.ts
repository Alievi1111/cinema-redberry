import type { MovieSessionType, MovieVenueSessions } from '../types/movie.types';

export const hasSessionStarted = (startsAt: string | null | undefined, now: number) => {
  if (!startsAt || now <= 0) return false;
  const start = Date.parse(startsAt);
  return Number.isFinite(start) && start <= now;
};

export const findNextBookableSession = (
  venues: MovieVenueSessions[],
  now: number
): MovieSessionType | null =>
  venues
    .flatMap((venue) => venue.sessions)
    .filter((session) =>
      !session.isSoldOut &&
      session.seatsLeft > 0 &&
      Number.isFinite(Date.parse(session.startsAt)) &&
      Date.parse(session.startsAt) > now
    )
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0] ?? null;
