export const formatTicketSession = (date: string, time: string): string => {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return `${date} · ${time}`;
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
    .format(parsedDate)
    .replace(',', '');

  return `${formattedDate} · ${time}`;
};
