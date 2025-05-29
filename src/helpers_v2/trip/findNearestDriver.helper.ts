import { userModel } from '../../app/modules/auth_v2/model/user.model';
import { LocationModel } from '../../app/modules/location/model/location.model';
import { MAXIMUM_DISTANCE_BETWEEN_USER_AND_DRIVER_IN_KM } from '../../data/environmentVariables';

/**
 * Finds nearest drivers within a radius of given coordinates.
 * @param longitude - user's longitude
 * @param latitude - user's latitude
 * @returns Array of driver objects without passwordHash
 */
export async function findNearestDrivers(longitude: number, latitude: number) {
  const radiusInKm = MAXIMUM_DISTANCE_BETWEEN_USER_AND_DRIVER_IN_KM;
  const radiusInRadians = radiusInKm / 6371; // Earth's radius in km

  // Find locations within the radius
  const nearbyLocations = await LocationModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radiusInRadians],
      },
    },
  });

  const userIds = nearbyLocations.map(loc => loc.userId);

  // Find users with role 'driver' and those userIds
  const drivers = await userModel.find({
    id: { $in: userIds },
    role: 'driver',
  });

  // Remove sensitive data before returning
  const sanitizedDrivers = drivers.map(driver => {
    const obj = driver.toObject();
    delete obj.passwordHash;
    return obj;
  });

  return sanitizedDrivers;
}
