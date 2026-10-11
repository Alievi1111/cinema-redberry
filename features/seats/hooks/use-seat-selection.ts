'use client';

import { useQuery } from '@tanstack/react-query';

import { getSeatMapApi, getSeatSessionApi } from '../api/get-seat-selection-api';

export const useSeatSelection = (
  sessionId: string,
  profileComplete: boolean
) => {
  const session = useQuery({
    queryKey: ['seat-session', sessionId],
    queryFn: ({ signal }) => getSeatSessionApi(sessionId, signal),
    retry: 1,
    staleTime: 1000 * 30,
  });

  const seatMap = useQuery({
    queryKey: ['seat-map', sessionId],
    queryFn: ({ signal }) => getSeatMapApi(sessionId, signal),
    enabled:
      profileComplete &&
      session.isSuccess &&
      !session.data.isSoldOut &&
      session.data.seatsLeft > 0,
    retry: 1,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
  });

  return { session, seatMap };
};
