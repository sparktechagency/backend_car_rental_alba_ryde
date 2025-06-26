import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';

export const getOwnCompletedBookingsOfDriverController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const userId = userData.id;
    const tripData = await TripModel.find({
      driverId: userId,
      status: 'completed',
    }).sort({
      updatedAt: -1,
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
