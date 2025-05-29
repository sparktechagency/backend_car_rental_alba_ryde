export const addSecondsToDate = (
  dateStr: string,
  secondsToAdd: number
): Date => {
  console.log({ dateStr, secondsToAdd });
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  const newTime = date.getTime() + secondsToAdd * 1000;
  return new Date(newTime);
};
