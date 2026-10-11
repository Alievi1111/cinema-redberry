'use client';

import {
  countActiveFilters,
  getAvailableFormats,
  getNextSevenDates,
} from '../../lib/session-filters';
import type {
  FilterOptions,
  SessionFilters,
} from '../../types/sessions.types';

type MultiSelectFilter = 'venues' | 'formats' | 'languages' | 'bands';

type SessionFiltersPanelProps = {
  options: FilterOptions;
  filters: SessionFilters;
  today: string;
  onToggle: (key: MultiSelectFilter, slug: string) => void;
  onDateChange: (date: string) => void;
  onClear: () => void;
};

const sectionClass = 'min-w-0 border-b border-[#2A2C3D] pb-[25px]';
const legendClass = 'mb-[12px] text-[12px] font-bold tracking-[0.03em] text-[#A9A9A9]';

const getTimeBandParts = (label: string) => {
  const match = label.match(/^(.*?)\s*\((.*?)\)$/);
  return match ? { name: match[1], detail: match[2] } : { name: label };
};

const FilterCheck = ({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail?: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center gap-[10px] min-h-[28px] cursor-pointer text-[13px] text-white">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-[#55596B] transition-colors peer-checked:border-[#FF321F] peer-checked:bg-[#FF321F] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FF321F]"
    >
      {checked && (
        <svg viewBox="0 0 16 16" fill="none" className="size-[13px] text-white">
          <path
            d="m3.2 8 3.1 3.1 6.5-6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span className="min-w-0">
      <span className="font-semibold">{label}</span>
      {detail && <span className="text-[#A9A9A9]"> · {detail}</span>}
    </span>
  </label>
);

const SessionFiltersPanel = ({
  options,
  filters,
  today,
  onToggle,
  onDateChange,
  onClear,
}: SessionFiltersPanelProps) => {
  const dates = getNextSevenDates(today);
  const formats = getAvailableFormats(options, filters.venues);
  const activeCount = countActiveFilters(filters);

  return (
    <aside
      aria-label="Session filters"
      className="flex w-full flex-col rounded-[16px] bg-[#1D2030] p-[24px] lg:sticky lg:top-[min(110px,calc(100vh-1024px))] lg:min-h-[1000px]"
    >
      <h2 className="mb-[22px] font-bold text-[18px] text-white">Filters</h2>

      <div className="flex flex-col gap-[24px]">
        <fieldset className={sectionClass}>
          <legend className={legendClass}>VENUE</legend>
          <div className="flex flex-col gap-[2px]">
            {options.venues.map((venue) => (
              <FilterCheck
                key={venue.slug}
                label={venue.name}
                detail={venue.city}
                checked={filters.venues.includes(venue.slug)}
                onChange={() => onToggle('venues', venue.slug)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className={legendClass}>DATE</legend>
          <div className="scrollbar-hidden flex max-w-full min-w-0 gap-[6px] overflow-x-auto overscroll-x-contain">
            {dates.map((date) => (
              <button
                key={date.value}
                type="button"
                aria-label={date.label}
                aria-pressed={filters.date === date.value}
                onClick={() => onDateChange(date.value)}
                className={`flex min-w-[42px] flex-col items-center rounded-[8px] px-[7px] py-[9px] text-[12px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF321F] ${
                  filters.date === date.value
                    ? 'bg-[#FF321F] text-white'
                    : 'bg-[#292C3D] text-white hover:bg-[#3B3E50]'
                }`}
              >
                <span className="font-semibold">{date.weekday}</span>
                <span>{date.day}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className={legendClass}>FORMAT</legend>
          <div className="flex flex-col gap-[2px]">
            {formats.map((format) => (
              <FilterCheck
                key={format.slug}
                label={format.name}
                checked={filters.formats.includes(format.slug)}
                onChange={() => onToggle('formats', format.slug)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className={legendClass}>LANGUAGE</legend>
          <div className="flex flex-col gap-[2px]">
            {options.languages.map((language) => (
              <FilterCheck
                key={language.slug}
                label={language.name}
                checked={filters.languages.includes(language.slug)}
                onChange={() => onToggle('languages', language.slug)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className={legendClass}>TIME OF DAY</legend>
          <div className="flex flex-col gap-[2px]">
            {options.timeBands.map((band) => {
              const { name, detail } = getTimeBandParts(band.label);
              return (
                <FilterCheck
                  key={band.id}
                  label={name}
                  detail={detail}
                  checked={filters.bands.includes(band.id)}
                  onChange={() => onToggle('bands', band.id)}
                />
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-auto flex flex-col items-center gap-[12px] pt-[32px]">
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="cursor-pointer text-[13px] font-semibold text-white hover:text-[#FF321F] focus-visible:outline-2 focus-visible:outline-[#FF321F]"
          >
            Clear All Filters
          </button>
        )}
        <p className="text-[#A9A9A9] text-[12px]">
          {activeCount} {activeCount === 1 ? 'filter' : 'filters'} active
        </p>
      </div>
    </aside>
  );
};

export default SessionFiltersPanel;
