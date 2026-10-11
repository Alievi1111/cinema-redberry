export const movieHref = (slug: string) =>
  `/movie/${encodeURIComponent(slug)}`;

export const movieBookingHref = (slug: string) =>
  `${movieHref(slug)}?book=1`;

export const movieSessionBookingHref = (slug: string, sessionId: number | string) =>
  `${movieHref(slug)}?bookingSession=${encodeURIComponent(String(sessionId))}`;
