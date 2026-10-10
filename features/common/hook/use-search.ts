'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { searchApi } from '../api/search-api';

export const SEARCH_QUERY_KEY = ['search'] as const;

export const useSearch = (value: string, enabled = true) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const normalizedQuery = value.trim();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(normalizedQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [normalizedQuery]);

  const isDebouncing = normalizedQuery !== debouncedQuery;
  const shouldFetch = enabled && debouncedQuery.length > 0;

  const { data, isPending, isError } = useQuery({
    queryKey: [...SEARCH_QUERY_KEY, debouncedQuery],
    queryFn: ({ signal }) => searchApi(debouncedQuery, signal),

    enabled: shouldFetch,
    retry: false,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  return {
    results: enabled && !isDebouncing ? (data ?? []) : [],
    isSearching:
      enabled &&
      normalizedQuery.length > 0 &&
      (isDebouncing || (shouldFetch && isPending)),
    isError: enabled && !isDebouncing && isError,
  };
};
