export interface MovieCalendarDay {
  date: string;
  day: string;
  number: string;
  isAvailable: boolean;
}

export const getCinemaToday = (): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tbilisi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
};

export const formatMovieDate = (value: string | null): string => {
  if (!value) return 'Not available';

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const getMovieCalendar = (
  availableDates: string[],
  selectedDate: string | null
) => {
  const today = getCinemaToday();
  const startDate = new Date(`${today}T00:00:00Z`);
  const availableSet = new Set(availableDates);

  const days: MovieCalendarDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + index);

    const dateString = date.toISOString().slice(0, 10);

    return {
      date: dateString,

      day: new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        timeZone: 'UTC',
      }).format(date),

      number: new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        timeZone: 'UTC',
      }).format(date),

      isAvailable: availableSet.has(dateString),
    };
  });

  const isSelectedDateAvailable = days.some(
    (day) => day.date === selectedDate && day.isAvailable
  );

  const activeDate =
    selectedDate && isSelectedDateAvailable
      ? selectedDate
      : (days.find((day) => day.isAvailable)?.date ?? null);

  return { days, activeDate };
};
