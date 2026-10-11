'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyTicketsApi } from '../api/get-my-tickets-api';
import { useAuthUser } from '@/features/auth/hook/use-auth-user';

export const MY_TICKETS_QUERY_KEY = ['my-tickets'] as const;

export const useMyTickets = () => {
  const { user, isAuthenticated } = useAuthUser();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: [...MY_TICKETS_QUERY_KEY, user?.id],

    queryFn: ({ signal }) => getMyTicketsApi(signal),

    enabled: isAuthenticated,

    retry: false,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const orders = data ?? [];

  const upcoming = orders.filter(
    (order) => order.isUpcoming && order.status === 'paid'
  );

  const past = orders.filter(
    (order) => !order.isUpcoming || order.status !== 'paid'
  );

  return {
    upcoming,
    past,
    upcomingCount: upcoming.length,
    pastCount: past.length,

    isLoading: isAuthenticated && isPending,
    isError,
    refetch,
  };
};
