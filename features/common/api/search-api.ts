import {
  SearchResponse,
  SearchResult,
} from '@/features/common/types/search.types';
import { api } from '@/lib/api';

export const searchApi = async (
  query: string,
  signal?: AbortSignal
): Promise<SearchResult[]> => {
  const response = await api.get<SearchResponse>('/search', {
    params: { q: query },
    signal,
  });

  return response.data.data;
};
