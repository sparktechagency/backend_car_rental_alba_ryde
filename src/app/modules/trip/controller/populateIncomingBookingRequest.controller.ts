import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { TripModel } from '../model/trip.model';
import { generateRandomTrip2 } from '../../../../helpers_v2/trip/generateRandomTripRequest.helper';

export const populateIncomingBookingRequestController = myControllerHandler(
  async (req, res) => {
    const userData = await userModel.find({});
    for (let i = 0; i < userData.length; i++) {
      const singleUserData = userData[i];
      const tripRequestOfUserData = await TripModel.findOne({
        customerId: singleUserData.id,
        type: 'user_request',
      });
      if (tripRequestOfUserData) {
      } else {
        const randomTripData = generateRandomTrip2();
        await TripModel.create({
          customerId: singleUserData.id,
          type: 'user_request',
          pickupLocation: randomTripData.pickupLocation,
          dropoffLocation: randomTripData.dropoffLocation,
          price: randomTripData.price,
          carType: randomTripData.carType,
          pickupTime: randomTripData.pickupTime,
          estimatedTimeInSeconds: randomTripData.estimatedTimeInSeconds,
          distanceInKilometers: randomTripData.distanceInKilometers,
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
