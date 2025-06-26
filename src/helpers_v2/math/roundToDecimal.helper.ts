export const roundToDecimal = (num: number, decimalPlaces: number): number => {
  return parseFloat(num.toFixed(decimalPlaces));
};
