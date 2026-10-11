'use client';

import { useQuery } from '@tanstack/react-query';
import { getMovieApi } from '../api/movie-api';

export const MOVIE_QUERY_KEY = ['movie'] as const;

export const useMovie = (movieId: string) => {
  const query = useQuery({
    queryKey: [...MOVIE_QUERY_KEY, movieId],
    queryFn: ({ signal }) => getMovieApi(movieId, signal),
    enabled: Boolean(movieId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    movie: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
