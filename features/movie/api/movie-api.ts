import { api } from '@/lib/api';

import type {
  MovieDetailsResponse,
  MovieDetailsType,
  MovieSessionsResponse,
  MovieVenueSessions,
} from '../types/movie.types';

export const getMovieApi = async (
  movieId: string,
  signal?: AbortSignal
): Promise<MovieDetailsType> => {
  const response = await api.get<MovieDetailsResponse>(
    `/movies/${encodeURIComponent(movieId)}`,
    { signal }
  );

  return response.data.data;
};

export const getMovieSessionsApi = async (
  movieId: string,
  date: string,
  signal?: AbortSignal
): Promise<MovieVenueSessions[]> => {
  const response = await api.get<MovieSessionsResponse>(
    `/movies/${encodeURIComponent(movieId)}/sessions`,
    {
      params: { date },
      signal,
    }
  );

  return response.data.data;
};
