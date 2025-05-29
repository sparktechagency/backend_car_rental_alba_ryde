export const checkIfExists = (data: unknown, name: string): asserts data => {
  if (!data) {
    throw new Error(`${name} does not exist`);
  }
};
