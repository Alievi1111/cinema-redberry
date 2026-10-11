'use client';

import { useQuery } from '@tanstack/react-query';
import { getMovieSessionsApi } from '../api/movie-api';

export const MOVIE_SESSIONS_QUERY_KEY = ['movie-sessions'] as const;

export const useMovieSessions = (
  movieId: string,
  date: string | null,
  enabled = true
) => {
  const query = useQuery({
    queryKey: [...MOVIE_SESSIONS_QUERY_KEY, movieId, date],

    queryFn: ({ signal }) => getMovieSessionsApi(movieId, date!, signal),

    enabled: enabled && Boolean(movieId && date),

    staleTime: 1000 * 15,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  return {
    venues: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus === 'fetching',
    isError: query.isError,
    refetch: query.refetch,
  };
};
