'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  getAvailableFormats,
  getTodayInTbilisi,
  parseSessionFilters,
  toSessionSearchParams,
  toggleSlug,
} from '../lib/session-filters';
import type { FilterOptions, SessionFilters } from '../types/sessions.types';

type MultiSelectFilter = 'venues' | 'formats' | 'languages' | 'bands';

export const useSessionFilters = (options: FilterOptions | null) => {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const today = getTodayInTbilisi();
  const filters = options
    ? parseSessionFilters(new URLSearchParams(queryString), options, today)
    : null;
  const canonicalQuery = filters
    ? toSessionSearchParams(filters).toString()
    : null;

  useEffect(() => {
    if (
      !canonicalQuery ||
      queryString === canonicalQuery ||
      window.location.search.slice(1) !== queryString
    ) {
      return;
    }

    window.history.replaceState(null, '', `/sessions?${canonicalQuery}`);
  }, [canonicalQuery, queryString]);

  const change = (update: (current: SessionFilters) => SessionFilters) => {
    if (!options) return;

    // Read the live URL so quick successive clicks do not overwrite each other.
    const current = parseSessionFilters(
      new URLSearchParams(window.location.search),
      options,
      getTodayInTbilisi()
    );
    const next = { ...update(current), page: 1 };
    const query = toSessionSearchParams(next).toString();

    if (query !== window.location.search.slice(1)) {
      window.history.pushState(null, '', `/sessions?${query}`);
    }
  };

  const toggle = (key: MultiSelectFilter, slug: string) => {
    if (!options) return;

    change((current) => {
      const next = { ...current, [key]: toggleSlug(current[key], slug) };

      if (key === 'venues') {
        const available = new Set(
          getAvailableFormats(options, next.venues).map((format) => format.slug)
        );
        next.formats = next.formats.filter((format) => available.has(format));
      }

      return next;
    });
  };

  const setDate = (date: string) => change((current) => ({ ...current, date }));
  const setSort = (sort: string) => change((current) => ({ ...current, sort }));
  const clear = () =>
    change((current) => ({
      ...current,
      venues: [],
      formats: [],
      languages: [],
      bands: [],
      search: '',
    }));

  return { filters, today, toggle, setDate, setSort, clear };
};
