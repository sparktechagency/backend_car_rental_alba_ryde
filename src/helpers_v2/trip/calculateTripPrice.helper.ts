import {
  INCREASE_PERCENTAGE,
  RATE_PER_KM,
} from '../../data/environmentVariables';

export const calculateTripPrice = (distance: number) => {
  const price = distance * RATE_PER_KM;
  const finalPrice = price * (1 + INCREASE_PERCENTAGE / 100);
  const rounded = Math.round(finalPrice * 100) / 100;
  return rounded;
};
