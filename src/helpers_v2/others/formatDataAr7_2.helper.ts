export const formatDateAr7_2 = (dateString: any): string => {
  const date = new Date(dateString);

  // Extract day with ordinal suffix (e.g., 11th, 2nd, 3rd)
  const day = date.getDate();
  const daySuffix = ['th', 'st', 'nd', 'rd'][((day % 100) - 20) % 10] || 'th';

  // Get formatted month, year, and time
  const month = date.toLocaleString('en-US', { month: 'long' }); // Full month name
  const year = date.getFullYear();
  const time = date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${day}${daySuffix} ${month}, ${year}, ${time.toLowerCase()}`;
};
