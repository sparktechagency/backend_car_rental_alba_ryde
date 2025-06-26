import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { TripModel } from '../model/trip.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';

export const acceptBookingRequestController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const { trip_id } = req.body;
    const tripData = await TripModel.findOne({
      id: trip_id,
    });
    if (!tripData) {
      throw new Error('trip booking request does not exists with this id');
    }
    if (tripData.type === 'booked') {
      throw new Error('this trip is already booked');
    }
    if (tripData.type !== 'user_request') {
      throw new Error('this trip can not be accepted. request is invalid.');
    }
    const bookedTripDataOfThisDriver = await TripModel.find({
      driverId: userData.id,
      type: 'booked',
      status: 'accepted',
    });

    const estimatedNeededTimeInSeconds: any = tripData.estimatedTimeInSeconds;
    const pickupTime: any = tripData.pickupTime; // Date object
    const tripEndTime = new Date(
      pickupTime.getTime() + estimatedNeededTimeInSeconds * 1000
    );

    for (let i = 0; i < bookedTripDataOfThisDriver.length; i++) {
      const singleBookedData = bookedTripDataOfThisDriver[i];
      const estimatedNeededTimeInSeconds2: any =
        singleBookedData.estimatedTimeInSeconds;
      const pickupTime2: any = singleBookedData.pickupTime; // Date object
      const tripEndTime2 = new Date(
        pickupTime2.getTime() + estimatedNeededTimeInSeconds2 * 1000
      );

      // Check overlap condition
      const tripsOverlap =
        pickupTime <= tripEndTime2 && pickupTime2 <= tripEndTime;

      if (tripsOverlap) {
        throw new Error('you already have an ongoing trip at that time');
      }
    }

    tripData.type = 'booked';
    tripData.status = 'accepted';
    tripData.driverId = userData.id;

    const updatedTripData = await tripData.save();

    const myResponse = {
      message: 'Trip Confirmation Successful',
      success: true,
      data: { updatedTripData },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
