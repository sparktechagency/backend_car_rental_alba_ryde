export const formatDateAR7 = (timestamp: string): string => {
  const date = new Date(timestamp);

  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const year = date.getUTCFullYear();

  const suffix = (d: number): string => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${suffix(day)} ${month}, ${year}`;
};
