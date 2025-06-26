import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { CarModel } from '../../car/model/car.model';
import { TripModel } from '../model/trip.model';

export const getIncomingBookingRequestController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const carData = await CarModel.findOne({ ownerId: userData.id });
    if (!carData) {
      throw new Error(
        'you are not eligible to see this data because you do not have a car.'
      );
    }

    const incomingRequest = await TripModel.find({
      type: 'user_request',
      carType: carData.carType,
      status: {
        $nin: ['cancelled'],
      },
    });

    const tripsThatAreAlreadyBooked = await TripModel.find({
      type: 'booked',
      status: { $in: ['accepted', 'ongoing'] },
    });
    const refinedData: any = [];

    for (let i = 0; i < incomingRequest.length; i++) {
      const singleData = incomingRequest[i];
      const estimatedTimeInSeconds1: any = singleData.estimatedTimeInSeconds;
      const pickupTime1: any = singleData.pickupTime; // Date object

      const trip1EndTime = new Date(
        pickupTime1.getTime() + estimatedTimeInSeconds1 * 1000
      );

      // Flag to track overlap
      let hasOverlap = false;

      for (let j = 0; j < tripsThatAreAlreadyBooked.length; j++) {
        const singleAlreadyBookedTrip = tripsThatAreAlreadyBooked[j];
        const estimatedTimeInSeconds2: any =
          singleAlreadyBookedTrip.estimatedTimeInSeconds;
        const pickupTime2: any = singleAlreadyBookedTrip.pickupTime; // Date object

        const trip2EndTime = new Date(
          pickupTime2.getTime() + estimatedTimeInSeconds2 * 1000
        );

        const tripsOverlap =
          pickupTime1 <= trip2EndTime && pickupTime2 <= trip1EndTime;

        if (tripsOverlap) {
          hasOverlap = true;
          break; // No need to check further, one overlap is enough to reject
        }
      }

      // Push only if no overlaps found with any booked trips
      if (!hasOverlap) {
        refinedData.push(singleData);
      }
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        totalNumber: refinedData.length,
        requests: refinedData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
