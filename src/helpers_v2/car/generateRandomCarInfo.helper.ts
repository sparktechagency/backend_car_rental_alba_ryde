export const generateRandomCarData = () => {
  const carBrands = ['Toyota', 'Honda', 'Ford', 'Nissan', 'Suzuki', 'Mazda'];
  const carModels = ['Corolla', 'Civic', 'Focus', 'Sentra', 'Swift', 'Axela'];
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

  const randomFromArray = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const carBrand = randomFromArray(carBrands);
  const carModel = `${carBrand} ${randomFromArray(carModels)}`;
  const carType = randomFromArray(carTypes);
  const yearOfManufacture = Math.floor(Math.random() * 15) + 2008; // Between 2008–2023
  const licensePlate = `test_license_${Math.random()
    .toString(36)
    .substring(2, 8)}`;
  const now = new Date();

  // Example: approved price per hour between 10 and 100
  const approvedPricePerHour = Math.floor(Math.random() * 91) + 10;

  // New field: price per kilometer between 5 and 50
  const pricePerKilometer = Math.floor(Math.random() * 46) + 5;

  return {
    carBrand,
    carModel,
    yearOfManufacture,
    licensePlate,
    carType,
    approvedPricePerHour,
    pricePerKilometer,
    id: `car_${Math.random()}`,
    createdAt: now,
    updatedAt: now,
    __v: 0,
  };
};
