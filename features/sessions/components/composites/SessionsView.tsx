'use client';

import { useEffect, useRef } from 'react';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import { useSessionClock } from '@/features/movie/hooks/use-session-clock';
import { useFilterOptions } from '../../hook/use-filter-options';
import { useSessionFilters } from '../../hook/use-session-filters';
import { useSessions } from '../../hook/use-sessions';
import SessionFiltersPanel from './SessionFiltersPanel';
import SessionMovieGroup from './SessionMovieGroup';
import SessionResultsSkeleton from './SessionResultsSkeleton';
import SessionPagination from '../primitives/SessionPagination';
import SessionSortMenu from '../primitives/SessionSortMenu';

const SessionsView = () => {
  const { user } = useAuthUser();
  const now = useSessionClock();
  const resultsRef = useRef<HTMLElement>(null);
  const optionsQuery = useFilterOptions();
  const options = optionsQuery.data ?? null;
  const { filters, today, toggle, setDate, setSort, setPage, clear } =
    useSessionFilters(options);
  const sessionsQuery = useSessions(filters);
  const actualPage = sessionsQuery.data?.meta.currentPage;
  const requestedPage = filters?.page;

  useEffect(() => {
    if (
      requestedPage !== undefined &&
      actualPage !== undefined &&
      requestedPage !== actualPage &&
      new URLSearchParams(window.location.search).get('page') ===
        String(requestedPage)
    ) {
      setPage(actualPage, true);
    }
  }, [actualPage, requestedPage, setPage]);

  const handlePageChange = (page: number) => {
    if (page === filters?.page) return;
    setPage(page);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (optionsQuery.isPending) {
    return (
      <div className="gap-[51px] lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="bg-[#1D2030] rounded-[16px] min-h-[880px] lg:min-h-[1000px] motion-safe:animate-pulse" />
        <div className="mt-[32px] min-w-0 lg:mt-0">
          <SessionResultsSkeleton showToolbar />
        </div>
      </div>
    );
  }

  if (optionsQuery.isError || !options || !filters) {
    return (
      <div role="alert" className="text-white">
        <p>Could not load the session filters.</p>
        <button
          type="button"
          onClick={() => void optionsQuery.refetch()}
          className="mt-3 font-semibold text-[#FF321F] cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  const totalSessions = sessionsQuery.data?.meta.totalSessions;

  return (
    <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] gap-[51px] items-start">
      <SessionFiltersPanel
        options={options}
        filters={filters}
        today={today}
        onToggle={toggle}
        onDateChange={setDate}
        onClear={clear}
      />

      <section
        ref={resultsRef}
        aria-label="Session results"
        aria-busy={sessionsQuery.isPending}
        className="mt-[32px] min-w-0 scroll-mt-[130px] lg:mt-0"
      >
        <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 min-h-[28px]">
          <p aria-live="polite" className="font-semibold text-[14px] text-white">
            {sessionsQuery.isPending
              ? 'Loading sessions…'
              : totalSessions === 0
                ? 'No sessions found'
                : `Showing ${totalSessions ?? 0} sessions`}
          </p>

          <SessionSortMenu
            options={options.sorts}
            value={filters.sort}
            onChange={setSort}
          />
        </div>

        {filters.search && (
          <p className="mt-3 text-[13px] text-[#A9A9A9]">
            Search: <span className="text-white">{filters.search}</span>
          </p>
        )}

        {sessionsQuery.isError ? (
          <div role="alert" className="mt-[30px] text-white">
            <p>Could not load sessions for these filters.</p>
            <button
              type="button"
              onClick={() => void sessionsQuery.refetch()}
              className="mt-3 font-semibold text-[#FF321F] cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : sessionsQuery.isPending ? (
          <SessionResultsSkeleton />
        ) : (
          <>
            {sessionsQuery.data.data.length === 0 ? (
              <p className="mt-[30px] text-[#A9A9A9]">
                Try another date or change a filter.
              </p>
            ) : (
              <ul className="mt-[24px] min-w-0 divide-y divide-[#2A2C3D]">
                {sessionsQuery.data.data.map((group) => (
                  <SessionMovieGroup
                    key={group.movie.id}
                    group={group}
                    viewerAge={user?.age ?? null}
                    now={now}
                  />
                ))}
              </ul>
            )}

            <SessionPagination
              currentPage={sessionsQuery.data.meta.currentPage}
              lastPage={sessionsQuery.data.meta.lastPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default SessionsView;
