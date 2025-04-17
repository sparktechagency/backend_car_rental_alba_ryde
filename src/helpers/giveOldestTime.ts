export const getOldestTime = (timestamps: string[]): string | null => {
  if (timestamps.length === 0) return null;

  let oldest = timestamps[0]; // Assume first element is the oldest

  for (let i = 1; i < timestamps.length; i++) {
    if (new Date(timestamps[i]) < new Date(oldest)) {
      oldest = timestamps[i]; // Update if a smaller (older) date is found
    }
  }

  return oldest;
};
