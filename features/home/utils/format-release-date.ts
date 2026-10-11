export const formatReleaseDate = (value: string | null): string | null => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return null;

  return date
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    })
    .toUpperCase();
};
