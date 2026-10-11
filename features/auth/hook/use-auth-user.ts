'use client';

import { useQuery } from '@tanstack/react-query';

import { getMeApi } from '../api/get-me-api';
import { useAuthSession } from './use-auth-session';

export const AUTH_USER_QUERY_KEY = ['auth-user'] as const;

export const useAuthUser = () => {
  const { sessionId, isReady } = useAuthSession();

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: [...AUTH_USER_QUERY_KEY, sessionId],
    queryFn: getMeApi,

    enabled: isReady && Boolean(sessionId),

    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const user = sessionId && !isError ? (data ?? null) : null;

  return {
    user,
    isAuthenticated: Boolean(user),
    hasToken: Boolean(sessionId),

    isLoading: !isReady || (Boolean(sessionId) && isPending),
    isFetching,
    isError: Boolean(sessionId) && isError,

    refetch,
  };
};
