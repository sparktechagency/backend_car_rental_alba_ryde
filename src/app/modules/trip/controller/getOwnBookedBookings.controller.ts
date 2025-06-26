import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';

export const getOwnConfirmedBookedTripsController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);

    const tripsData = await TripModel.find({
      customerId: userData.id,
      type: 'booked',
      status: 'accepted',
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: { confirmedBookedTrips: tripsData },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
