import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';

export const getOwnCancelledBookingTripsController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const tripData = await TripModel.find({
      customerId: userData.id,
      status: 'cancelled',
    }).sort({
      createdAt: -1,
    });
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        tripData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
