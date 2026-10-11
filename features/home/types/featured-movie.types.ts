export interface FeaturedMovie {
  id: number;
  slug: string;
  title: string;
  backdropUrl: string | null;
  releaseDate: string | null;
  runtimeMinutes: number | null;
  synopsis: string | null;
  fromPrice: number | null;
  ageRating: {
    code: string;
    minAge: number;
    description: string;
  } | null;
  formats: {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
  }[];
}

export interface FeaturedMoviesResponse {
  data: FeaturedMovie[];
}
