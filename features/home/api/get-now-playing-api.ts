import { api } from '@/lib/api';

import type {
  NowPlayingMovie,
  NowPlayingResponse,
} from '../types/now-playing.types';

interface GetNowPlayingParams {
  limit?: number;
  signal?: AbortSignal;
}

export const getNowPlayingApi = async ({
  limit,
  signal,
}: GetNowPlayingParams = {}): Promise<NowPlayingMovie[]> => {
  const response = await api.get<NowPlayingResponse>('/movies/now-playing', {
    params: limit !== undefined ? { limit } : undefined,
    signal,
  });

  return response.data.data;
};
