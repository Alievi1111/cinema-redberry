import { api } from '@/lib/api';

import type { FilterOptionsResponse } from '../types/sessions.types';

export const getFilterOptionsApi = async (signal?: AbortSignal) => {
  const response = await api.get<FilterOptionsResponse>('/filter-options', {
    signal,
  });

  return response.data.data;
};
