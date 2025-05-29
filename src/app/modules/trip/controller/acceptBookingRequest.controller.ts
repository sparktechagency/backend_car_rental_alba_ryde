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
      type: 'user_request',
    });
    if (!tripData) {
      throw new Error('trip booking request does not exists with this id');
    }

    tripData.type = 'booked';
    tripData.status = 'accepted';
    tripData.driverId = userData.id;

    const updatedTripData = await tripData.save();

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: { updatedTripData },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
