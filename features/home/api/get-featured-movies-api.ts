import { api } from '@/lib/api';

import type {
  FeaturedMovie,
  FeaturedMoviesResponse,
} from '../types/featured-movie.types';

export async function getFeaturedMoviesApi(): Promise<FeaturedMovie[]> {
  const response = await api.get<FeaturedMoviesResponse>('/movies/featured');

  return response.data.data;
}
