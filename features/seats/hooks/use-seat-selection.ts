'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hook/use-auth-session';

import { getSeatMapApi, getSeatSessionApi } from '../api/get-seat-selection-api';

export const useSeatSelection = (
  sessionId: string,
  profileComplete: boolean
) => {
  const { sessionId: authSessionId } = useAuthSession();
  const session = useQuery({
    queryKey: ['seat-session', sessionId],
    queryFn: ({ signal }) => getSeatSessionApi(sessionId, signal),
    retry: 1,
    staleTime: 1000 * 30,
  });

  const seatMap = useQuery({
    queryKey: ['seat-map', sessionId, authSessionId],
    queryFn: ({ signal }) => getSeatMapApi(sessionId, signal),
    enabled: profileComplete && session.isSuccess,
    retry: 1,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
  });

  return { session, seatMap };
};
