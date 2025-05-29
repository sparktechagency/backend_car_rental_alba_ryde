export const generateRandomLocationsWithin = (
  longitude: number,
  latitude: number,
  withinInKm: number
): { longitude: number; latitude: number } => {
  const earthRadiusInKm = 6371;

  // Convert distance from km to radians
  const radiusInRadians = withinInKm / earthRadiusInKm;

  // Random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInRadians;

  // Convert latitude and longitude from degrees to radians
  const lat1 = (latitude * Math.PI) / 180;
  const lon1 = (longitude * Math.PI) / 180;

  // New latitude in radians
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance) +
      Math.cos(lat1) * Math.sin(distance) * Math.cos(angle)
  );

  // New longitude in radians
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(angle) * Math.sin(distance) * Math.cos(lat1),
      Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
    );

  // Convert back to degrees
  const newLat = (lat2 * 180) / Math.PI;
  const newLon = (lon2 * 180) / Math.PI;

  return {
    longitude: newLon,
    latitude: newLat,
  };
};
