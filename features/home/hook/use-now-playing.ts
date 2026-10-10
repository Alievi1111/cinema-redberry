'use client';

import { useQuery } from '@tanstack/react-query';

import { getNowPlayingApi } from '../api/get-now-playing-api';

export const NOW_PLAYING_QUERY_KEY = ['now-playing'] as const;

export const useNowPlaying = (limit?: number) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [...NOW_PLAYING_QUERY_KEY, limit ?? 'all'],

    queryFn: ({ signal }) => getNowPlayingApi({ limit, signal }),

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    movies: data ?? [],
    isLoading: isPending,
    isError,
    refetch,
  };
};
