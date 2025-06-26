import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { TripModel } from '../model/trip.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';

export const requestTripBookingController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);

    const { tripId } = req.body;
    const tripData = await TripModel.findOne({
      id: tripId,
    });

    if (!tripData) {
      throw new Error('invalid trip id');
    }

    if (tripData.customerId !== userData.id) {
      throw new Error('user is not eligible to make this trip');
    }
    if (tripData.type !== 'user_search') {
      throw new Error('this trip is not requestable');
    }

    await TripModel.deleteMany({
      customerId: userData.id,
      type: 'user_request',
    });
    tripData.type = 'user_request';
    await tripData.save();

    const myResponse = {
      message: 'request sent successfully',
      success: true,
      data: { tripData },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
