import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';

export const getOwnPendingBookingsController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const bookingsData = await TripModel.find({
      customerId: userData.id,
      type: 'user_request',
      status: {
        $nin: ['cancelled'],
      },
    }).sort({ createdAt: -1 });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        pendingBookings: bookingsData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
