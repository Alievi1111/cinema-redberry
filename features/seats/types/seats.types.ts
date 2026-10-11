export interface SeatSession {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: { id: number; name: string };
  venue: { id: number; name: string; city: string };
  format: { name: string };
  language: { name: string };
  movie: {
    slug: string;
    title: string;
    ageRating: { minAge: number; code: string } | null;
  };
}

export interface Seat {
  id: number;
  code: string;
  label: string;
  state: 'available' | 'sold' | 'held' | 'unavailable';
  aisleAfter: boolean;
  isMine: boolean;
}

export interface SeatMap {
  sessionId: number;
  hall: { id: number; name: string };
  sections: {
    name: string;
    rows: { label: string; seats: Seat[] }[];
  }[];
}

export interface SeatSessionResponse {
  data: SeatSession;
}

export interface SeatMapResponse {
  data: SeatMap;
}
