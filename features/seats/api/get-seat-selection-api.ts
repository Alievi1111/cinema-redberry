import { api } from '@/lib/api';

import type {
  SeatMap,
  SeatMapResponse,
  SeatSession,
  SeatSessionResponse,
} from '../types/seats.types';

export const getSeatSessionApi = async (
  sessionId: string,
  signal?: AbortSignal
): Promise<SeatSession> => {
  const response = await api.get<SeatSessionResponse>(
    `/sessions/${encodeURIComponent(sessionId)}`,
    { signal }
  );

  return response.data.data;
};

export const getSeatMapApi = async (
  sessionId: string,
  signal?: AbortSignal
): Promise<SeatMap> => {
  const response = await api.get<SeatMapResponse>(
    `/sessions/${encodeURIComponent(sessionId)}/seats`,
    { signal }
  );

  return response.data.data;
};
