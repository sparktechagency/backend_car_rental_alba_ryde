type GeoPoint = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};

type Trip = {
  pickupLocation: GeoPoint;
  dropoffLocation: GeoPoint;
  _id: string;
  customerId: string;
  type: 'user_request';
  price: number;
  carType:
    | 'sedan'
    | 'suv'
    | 'truck'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'minivan'
    | 'wagon';

  pickupTime: Date;
  estimatedTimeInSeconds: number;
  distanceInKilometers: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const getRandomCoordinateInDhaka = (): [number, number] => {
  const lat = 23.7 + Math.random() * 0.2;
  const lon = 90.35 + Math.random() * 0.15;
  return [parseFloat(lon.toFixed(8)), parseFloat(lat.toFixed(8))];
};

const generateObjectId = (): string => {
  const hexChars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }
  return result;
};

const generateRandomString = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateRandomTrip2 = (): Trip => {
  const pickupLocation: GeoPoint = {
    type: 'Point',
    coordinates: getRandomCoordinateInDhaka(),
  };

  let dropoffLocation: GeoPoint = {
    type: 'Point',
    coordinates: getRandomCoordinateInDhaka(),
  };

  if (
    pickupLocation.coordinates[0] === dropoffLocation.coordinates[0] &&
    pickupLocation.coordinates[1] === dropoffLocation.coordinates[1]
  ) {
    dropoffLocation = {
      type: 'Point',
      coordinates: [
        dropoffLocation.coordinates[0] + 0.01,
        dropoffLocation.coordinates[1] + 0.01,
      ],
    };
  }

  const pickupTime = new Date(
    Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 10)
  );

  const estimatedTimeInSeconds = Math.floor(Math.random() * 7200) + 600; // 10min to 2h

  const distanceInKilometers = parseFloat(
    ((estimatedTimeInSeconds / 60) * 0.3).toFixed(1)
  );
  const arrayOfCars = [
    'sedan',
    'suv',
    'truck',
    'hatchback',
    'coupe',
    'convertible',
    'minivan',
    'wagon',
  ];
  return {
    pickupLocation,
    dropoffLocation,
    _id: generateObjectId(),
    customerId: 'user_' + generateRandomString(64),
    type: 'user_request',
    price: parseFloat((Math.random() * 300).toFixed(1)),
    carType: (
      [
        'sedan',
        'suv',
        'truck',
        'hatchback',
        'coupe',
        'convertible',
        'minivan',
        'wagon',
      ] as const
    )[Math.floor(Math.random() * 8)],
    pickupTime,
    estimatedTimeInSeconds,
    distanceInKilometers,
    id: 'trip_' + generateRandomString(64),
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  };
};
