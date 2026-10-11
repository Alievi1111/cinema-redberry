import type {
  FilterOptions,
  SessionFilters,
  SessionFormat,
} from '../types/sessions.types';

const ARRAY_PARAMS = {
  venues: 'venues[]',
  formats: 'formats[]',
  languages: 'languages[]',
  bands: 'bands[]',
} as const;

export const getTodayInTbilisi = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tbilisi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${value('year')}-${value('month')}-${value('day')}`;
};

export const getNextSevenDates = (today: string) => {
  const [year, month, day] = today.split('-').map(Number);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day + index));

    return {
      value: date.toISOString().slice(0, 10),
      weekday: new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      }).format(date),
      day: date.getUTCDate(),
      label: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeZone: 'UTC',
      }).format(date),
    };
  });
};

const selectedSlugs = (
  params: URLSearchParams,
  name: string,
  validSlugs: string[]
) => {
  const valid = new Set(validSlugs);
  return [...new Set(params.getAll(name).filter((slug) => valid.has(slug)))];
};

export const getAvailableFormats = (
  options: FilterOptions,
  selectedVenues: string[]
): SessionFormat[] => {
  if (selectedVenues.length === 0) return options.formats;

  const selected = new Set(selectedVenues);
  const available = new Set(
    options.venues
      .filter((venue) => selected.has(venue.slug))
      .flatMap((venue) => venue.formats.map((format) => format.slug))
  );

  return options.formats.filter((format) => available.has(format.slug));
};

export const parseSessionFilters = (
  params: URLSearchParams,
  options: FilterOptions,
  today: string
): SessionFilters => {
  const allowedDates = new Set(getNextSevenDates(today).map((day) => day.value));
  const requestedDate = params.get('date');
  const venues = selectedSlugs(
    params,
    ARRAY_PARAMS.venues,
    options.venues.map((venue) => venue.slug)
  );
  const availableFormats = getAvailableFormats(options, venues);
  const requestedSort = params.get('sort');
  const defaultSort =
    options.sorts.find((sort) => sort.id === 'time_asc')?.id ??
    options.sorts[0]?.id ??
    'time_asc';
  const selectedSort = options.sorts.find((sort) => sort.id === requestedSort);
  const requestedPage = params.get('page') ?? '1';
  const page = Number(requestedPage);

  return {
    date: requestedDate && allowedDates.has(requestedDate) ? requestedDate : today,
    venues,
    formats: selectedSlugs(
      params,
      ARRAY_PARAMS.formats,
      availableFormats.map((format) => format.slug)
    ),
    languages: selectedSlugs(
      params,
      ARRAY_PARAMS.languages,
      options.languages.map((language) => language.slug)
    ),
    bands: selectedSlugs(
      params,
      ARRAY_PARAMS.bands,
      options.timeBands.map((band) => band.id)
    ),
    search: params.get('search')?.trim() ?? '',
    sort: selectedSort?.id ?? defaultSort,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
};

export const toSessionSearchParams = (filters: SessionFilters) => {
  const params = new URLSearchParams();
  params.set('date', filters.date);

  for (const key of Object.keys(ARRAY_PARAMS) as (keyof typeof ARRAY_PARAMS)[]) {
    for (const slug of filters[key]) {
      params.append(ARRAY_PARAMS[key], slug);
    }
  }

  if (filters.search) params.set('search', filters.search);
  params.set('sort', filters.sort);
  params.set('page', String(filters.page));
  return params;
};

export const toggleSlug = (selected: string[], slug: string) =>
  selected.includes(slug)
    ? selected.filter((value) => value !== slug)
    : [...selected, slug];

export const countActiveFilters = (filters: SessionFilters) =>
  filters.venues.length +
  filters.formats.length +
  filters.languages.length +
  filters.bands.length +
  Number(Boolean(filters.search));
