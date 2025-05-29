import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { LocationModel } from '../../location/model/location.model';
import { userModel } from '../../auth_v2/model/user.model';
import { generateRandomLocationsWithin } from '../../../../helpers_v2/location/generateRandomLocationsWithin.helper';
import { TripModel } from '../model/trip.model';
import { generateRandomTripData } from '../../../../helpers_v2/trip/generateRandomTrip.controller';

export const populateTripRequestController = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest2(req);
    const { withinKm } = req.body;
    const userLocation = await LocationModel.findOne({ userId: userData.id });
    if (!userLocation || !userLocation.location) {
      throw new Error('plz sync user location first');
    }
    const userCoordinates = userLocation.location.coordinates;
    const usersData = await userModel.find({
      role: 'user',
    });
    for (let i = 0; i < usersData.length; i++) {
      const singleUserData = usersData[i];
      const newCoordinates = generateRandomLocationsWithin(
        userCoordinates[0],
        userCoordinates[1],
        withinKm
      );
      const pendingTrip = await TripModel.findOne({
        customerId: singleUserData.id,
        status: 'not_accepted',
      });
      if (pendingTrip && pendingTrip.pickupLocation) {
        pendingTrip.pickupLocation.coordinates = [
          newCoordinates.longitude,
          newCoordinates.latitude,
        ];
        await pendingTrip.save();
      } else {
        const randomTripData = generateRandomTripData();
        await TripModel.create({
          customerId: singleUserData.id,
          status: 'not_accepted',
          price: randomTripData.price,
          carType: randomTripData.carType,
          pickupLocation: {
            type: 'Point',
            coordinates: [newCoordinates.longitude, newCoordinates.latitude],
          },
          dropoffLocation: randomTripData.dropoffLocation,
        });
      }
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
