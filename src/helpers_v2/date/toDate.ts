export const convertToDate = (input: string | Date): Date => {
  if (input instanceof Date) {
    return input;
  }
  return new Date(input);
};
