'use client';

import { useFilterOptions } from '../../hook/use-filter-options';
import { useSessionFilters } from '../../hook/use-session-filters';
import { useSessions } from '../../hook/use-sessions';
import SessionFiltersPanel from './SessionFiltersPanel';

const SessionsView = () => {
  const optionsQuery = useFilterOptions();
  const options = optionsQuery.data ?? null;
  const { filters, today, toggle, setDate, setSort, clear } =
    useSessionFilters(options);
  const sessionsQuery = useSessions(filters);

  if (optionsQuery.isPending) {
    return (
      <div className="lg:grid lg:grid-cols-[320px_minmax(0,1fr)] gap-[51px]">
        <div className="bg-[#1D2030] rounded-[16px] min-h-[880px] lg:min-h-[1000px] animate-pulse" />
        <p className="mt-8 lg:mt-0 text-[#A9A9A9]">Loading filters…</p>
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

      <section aria-label="Session results" className="mt-[32px] lg:mt-0 min-w-0">
        <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 min-h-[28px]">
          <p aria-live="polite" className="font-semibold text-[14px] text-white">
            {sessionsQuery.isPending
              ? 'Loading sessions…'
              : totalSessions === 0
                ? 'No sessions found'
                : `Showing ${totalSessions ?? 0} sessions`}
          </p>

          <label className="flex items-center gap-[8px] text-[13px] text-[#A9A9A9]">
            Sort:
            <select
              value={filters.sort}
              onChange={(event) => setSort(event.target.value)}
              className="bg-[#1D2030] rounded-[8px] px-3 py-2 max-w-full font-semibold text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF321F]"
            >
              {options.sorts.map((sort) => (
                <option key={sort.id} value={sort.id}>
                  {sort.label}
                </option>
              ))}
            </select>
          </label>
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
          <div className="mt-[30px] bg-[#1D2030] rounded-[16px] h-[200px] animate-pulse" />
        ) : sessionsQuery.data.data.length === 0 ? (
          <p className="mt-[30px] text-[#A9A9A9]">
            Try another date or change a filter.
          </p>
        ) : (
          <ul className="mt-[24px] divide-y divide-[#2A2C3D]">
            {sessionsQuery.data.data.map((group) => (
              <li
                key={group.movie.id}
                className="flex items-center justify-between gap-4 py-[20px] first:pt-0"
              >
                <h2 className="font-semibold text-white">{group.movie.title}</h2>
                <p className="shrink-0 text-[13px] text-[#A9A9A9]">
                  {group.sessions.length}{' '}
                  {group.sessions.length === 1 ? 'showtime' : 'showtimes'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default SessionsView;
