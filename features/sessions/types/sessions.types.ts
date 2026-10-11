export type SessionFormat = {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
};

export type SessionVenue = {
  id: number;
  slug: string;
  name: string;
  city: string;
  formats: SessionFormat[];
};

export type SessionLanguage = {
  id: number;
  slug: string;
  name: string;
  code: string;
};

export type FilterOptions = {
  venues: SessionVenue[];
  formats: SessionFormat[];
  languages: SessionLanguage[];
  timeBands: { id: string; label: string }[];
  sorts: { id: string; label: string }[];
};

export type FilterOptionsResponse = { data: FilterOptions };

export type SessionFilters = {
  date: string;
  venues: string[];
  formats: string[];
  languages: string[];
  bands: string[];
  search: string;
  sort: string;
  page: number;
};

export type SessionMovie = {
  id: number;
  slug: string;
  title: string;
  runtimeMinutes: number | null;
  posterUrl: string | null;
  ageRating: {
    code: string;
    minAge: number;
    description: string;
  } | null;
};

export type Showtime = {
  id: number;
  time: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: { id: number; name: string };
  venue: Pick<SessionVenue, 'id' | 'slug' | 'name' | 'city'>;
  format: SessionFormat;
  language: SessionLanguage;
};

export type SessionGroup = {
  movie: SessionMovie;
  sessions: Showtime[];
};

export type SessionsResponse = {
  data: SessionGroup[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalSessions: number;
    totalMovies: number;
    date: string;
  };
};
