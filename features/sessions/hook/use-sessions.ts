'use client';

import { useQuery } from '@tanstack/react-query';

import { getSessionsApi } from '../api/get-sessions-api';
import { toSessionSearchParams } from '../lib/session-filters';
import type { SessionFilters } from '../types/sessions.types';

export const useSessions = (filters: SessionFilters | null) =>
  useQuery({
    queryKey: ['sessions', filters && toSessionSearchParams(filters).toString()],
    queryFn: ({ signal }) => {
      if (!filters) throw new Error('Session filters are unavailable.');
      return getSessionsApi(filters, signal);
    },
    enabled: filters !== null,
    staleTime: 1000 * 15,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: 1,
  });
