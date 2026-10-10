'use client';

import { useQuery } from '@tanstack/react-query';

import { getFeaturedMoviesApi } from '../api/get-featured-movies-api';

export const FEATURED_MOVIES_QUERY_KEY = ['featured-movies'] as const;

export const useFeaturedMovies = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: FEATURED_MOVIES_QUERY_KEY,
    queryFn: getFeaturedMoviesApi,
    staleTime: 1000 * 60 * 5,
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
