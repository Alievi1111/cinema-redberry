export interface SearchResult {
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
  ageRating: {
    code: string;
    minAge: number;
    description: string;
  } | null;
  genres: {
    id: number;
    slug: string;
    name: string;
  }[];
  formats: {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
  }[];
}

export interface SearchResponse {
  data: SearchResult[];
}
