import { ar7id } from '../../helpers/ar7Id';

type Point = {
  type: 'Point';
  coordinates: [number, number];
};

export const generateRandomTripDataVersion3 = (): Record<string, any> => {
  // Valid coordinate generator (longitude, latitude)
  const randomCoord = (): [number, number] => {
    const lng = +(Math.random() * 360 - 180).toFixed(6); // Longitude: -180 to +180
    const lat = +(Math.random() * 180 - 90).toFixed(6); // Latitude: -90 to +90
    return [lng, lat];
  };

  const statuses = [
    'not_accepted',
    'pending',
    'accepted',
    'ongoing',
    'completed',
    'cancelled',
  ];
  const types = ['user_search', 'user_request', 'current', 'booked'];
  const carTypes = ['sedan', 'suv', 'hatchback'];
  const paymentStatuses = ['not_paid', 'paid'];
  const cancelledByOptions = ['user', 'driver'];

  const pickupCoords: [number, number] = randomCoord();
  const dropoffCoords: [number, number] = randomCoord();
  const totalPrice = +(Math.random() * 500 + 50).toFixed(2);
  const driverShare = +(totalPrice * 0.75).toFixed(2);
  const appShare = +(totalPrice - driverShare).toFixed(2);

  return {
    id: 'trip_' + ar7id(),
    customerId: 'cus_' + ar7id(),
    driverId: Math.random() > 0.3 ? 'drv_' + ar7id() : undefined,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    pickupLocationName: 'Random Pickup Place',
    pickupLocation: {
      type: 'Point',
      coordinates: pickupCoords,
    },
    dropoffLocationName: 'Random Dropoff Place',
    dropoffLocation: {
      type: 'Point',
      coordinates: dropoffCoords,
    },
    totalPrice,
    shareOfDriver: driverShare,
    shareOfApp: appShare,
    carType: carTypes[Math.floor(Math.random() * carTypes.length)],
    pickupTime: new Date(),
    dropoffTime: new Date(Date.now() + Math.random() * 3600000),
    estimatedTimeInSeconds: Math.floor(Math.random() * 3600),
    distanceInKilometers: +(Math.random() * 20).toFixed(2),
    paymentStatus:
      paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
    paymentIdInOwnDatabase: 'pay_' + ar7id(),
    routePolyline: 'abcxyz123polyline',
    isMarkedCompletedByUser: Math.random() > 0.5,
    isMarkedCompleteByDriver: Math.random() > 0.5,
    isPaymentReceivedByDriver: Math.random() > 0.5,
    cancelledBy:
      Math.random() > 0.8
        ? cancelledByOptions[Math.floor(Math.random() * 2)]
        : undefined,
    pricePaidForCancellation:
      Math.random() > 0.9 ? +(Math.random() * 20).toFixed(2) : undefined,
    isMoneyWithdrawnByDriver: Math.random() > 0.5,
  };
};
