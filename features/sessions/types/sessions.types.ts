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

export type SessionGroupSummary = {
  movie: { id: number; title: string };
  sessions: { id: number }[];
};

export type SessionsResponse = {
  data: SessionGroupSummary[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalSessions: number;
    totalMovies: number;
    date: string;
  };
};
