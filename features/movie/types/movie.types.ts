export interface MovieGenre {
  id: number;
  slug: string;
  name: string;
}

export interface MovieFormat {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
}

export interface MovieAgeRating {
  code: string;
  minAge: number;
  description: string;
}

export interface MovieDetailsType {
  id: number;
  slug: string;
  title: string;
  kind: string;
  runtimeMinutes: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  isComingSoon: boolean;
  isNotified: boolean;
  isFeatured: boolean;
  fromPrice: number | null;
  ageRating: MovieAgeRating | null;
  genres: MovieGenre[];
  formats: MovieFormat[];
  synopsis: string | null;
  director: string | null;
  cast: string | null;
  availableDates: string[];
}

export interface MovieDetailsResponse {
  data: MovieDetailsType;
}

export interface MovieVenue {
  id: number;
  slug: string;
  name: string;
  city: string;
}

export interface MovieSessionType {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: {
    id: number;
    name: string;
    venue: MovieVenue;
  };
  venue: MovieVenue;
  format: MovieFormat;
  language: {
    id: number;
    slug: string;
    name: string;
    code: string;
  };
}

export interface MovieVenueSessions {
  venue: MovieVenue;
  sessions: MovieSessionType[];
}

export interface MovieSessionsResponse {
  data: MovieVenueSessions[];
}
