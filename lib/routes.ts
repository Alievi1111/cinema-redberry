export const movieHref = (slug: string) =>
  `/movie/${encodeURIComponent(slug)}`;

export const seatSelectionHref = (sessionId: number | string) =>
  `/sessions/${encodeURIComponent(String(sessionId))}/seats`;
