'use client';

import { useQuery } from '@tanstack/react-query';

import { getFilterOptionsApi } from '../api/get-filter-options-api';

export const useFilterOptions = () =>
  useQuery({
    queryKey: ['filter-options'],
    queryFn: ({ signal }) => getFilterOptionsApi(signal),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: 1,
  });
