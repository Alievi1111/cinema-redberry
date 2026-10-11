import { api } from '@/lib/api';
import type {
  ComingSoonMovie,
  ComingSoonResponse,
} from '../types/coming-soon.types';

interface GetComingSoonParams {
  limit?: number;
  signal?: AbortSignal;
}

export const getComingSoonApi = async ({
  limit,
  signal,
}: GetComingSoonParams = {}): Promise<ComingSoonMovie[]> => {
  const response = await api.get<ComingSoonResponse>('/movies/coming-soon', {
    params: limit !== undefined ? { limit } : undefined,
    signal,
  });

  return response.data.data;
};
