import { api } from '@/lib/api';

import { toSessionSearchParams } from '../lib/session-filters';
import type { SessionFilters, SessionsResponse } from '../types/sessions.types';

export const getSessionsApi = async (
  filters: SessionFilters,
  signal?: AbortSignal
) => {
  const response = await api.get<SessionsResponse>('/sessions', {
    params: toSessionSearchParams(filters),
    signal,
  });

  return response.data;
};
