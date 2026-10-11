'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notifyMovieApi } from '../api/notify-movie-api';
import type { ComingSoonMovie } from '../types/coming-soon.types';
import { COMING_SOON_QUERY_KEY } from './use-coming-soon';

export const useNotifyMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notifyMovieApi,
    onSuccess: ({ subscribed }, movieSlug) => {
      if (!subscribed) return;

      queryClient.setQueriesData<ComingSoonMovie[]>(
        { queryKey: COMING_SOON_QUERY_KEY },
        (movies) =>
          movies?.map((movie) =>
            movie.slug === movieSlug ? { ...movie, isNotified: true } : movie
          )
      );
    },
  });
};
