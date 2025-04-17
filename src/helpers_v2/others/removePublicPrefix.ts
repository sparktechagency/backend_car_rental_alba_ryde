export const removePublicPrefix = (path: string): string =>
  path.replace(/^\.\/public/, '');
