import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';

function getRandomCoordinate(base: number, offset = 0.01): number {
  return parseFloat((base + (Math.random() - 0.5) * offset).toFixed(6));
}

export const generateRandomTripData = () => {
  const now = new Date();
  const carTypes = [
    'sedan',
    'suv',
    'truck',
    'hatchback',
    'coupe',
    'convertible',
    'minivan',
    'wagon',
  ];
  const randomFrom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const baseLongitude = 90.4;
  const baseLatitude = 23.78;

  const pickupLongitude = getRandomCoordinate(baseLongitude, 0.03);
  const pickupLatitude = getRandomCoordinate(baseLatitude, 0.03);

  const dropoffLongitude = getRandomCoordinate(baseLongitude + 0.04, 0.05);
  const dropoffLatitude = getRandomCoordinate(baseLatitude + 0.06, 0.05);

  return {
    pickupLocation: {
      type: 'Point',
      coordinates: [pickupLongitude, pickupLatitude],
    },
    dropoffLocation: {
      type: 'Point',
      coordinates: [dropoffLongitude, dropoffLatitude],
    },
    _id: new ObjectId(),
    customerId: `user_${randomUUID().replace(/-/g, '')}`,
    status: 'pending',
    price: parseFloat((Math.random() * 50 + 10).toFixed(2)), // between $10 and $60
    carType: randomFrom(carTypes),
    id: `trip_${randomUUID().replace(/-/g, '')}`,
    createdAt: now,
    updatedAt: now,
    __v: 0,
  };
};
