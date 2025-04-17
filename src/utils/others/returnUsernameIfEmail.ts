export const extractUsernameFromEmailAR7 = (str: string): string =>
  str.includes('@') ? str.split('@')[0] : str;
