'use client';

import { useQuery } from '@tanstack/react-query';
import { getComingSoonApi } from '../api/get-coming-soon-api';

export const COMING_SOON_QUERY_KEY = ['coming-soon'] as const;

export const useComingSoon = (limit?: number) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [...COMING_SOON_QUERY_KEY, limit ?? 'all'],
    queryFn: ({ signal }) => getComingSoonApi({ limit, signal }),
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
